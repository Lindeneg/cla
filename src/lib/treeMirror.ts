/*
modified: https://github.com/nardeas/treemirror
license : MIT License
*/

import {
  StringMap,
  NodeData,
  PositionData,
  AttributeData,
  TextData
} from '../util/types';
import {
  MutationSummary,
  Summary,
  NodeMap
} from '../lib/mutationSummary';


export class TreeMirrorClient {
  private nextId: number;

  private mutationSummary: MutationSummary;
  private knownNodes: NodeMap < number > ;

  constructor(public target: Node, public mirror: any) {
    this.nextId = 1;
    this.knownNodes = new MutationSummary.NodeMap < number > ();

    var rootId = this.serializeNode(target).id;
    var children: NodeData[] = [];
    for (var child = target.firstChild; child; child = child.nextSibling)
      children.push(this.serializeNode(child, true));

    this.mirror.initialize(rootId, children);

    var self = this;

    var queries = [{
      all: true
    }];

    this.mutationSummary = new MutationSummary({
      rootNode: target,
      callback: (summaries: Summary[]) => {
        this.applyChanged(summaries);
      },
      queries: queries
    });
  }


  disconnect() {
    if (this.mutationSummary) {
      this.mutationSummary.disconnect();
      this.mutationSummary = undefined;
    }
  }

  private rememberNode(node: Node): number {
    var id = this.nextId++;
    this.knownNodes.set(node, id);
    return id;
  }

  private forgetNode(node: Node) {
    this.knownNodes.delete(node);
  }

  private serializeNode(node: Node, recursive ? : boolean): NodeData {
    if (node === null)
      return null;

    var id = this.knownNodes.get(node);
    if (id !== undefined) {
      return {
        id: id
      };
    }

    var data: NodeData = {
      nodeType: node.nodeType,
      id: this.rememberNode(node)
    };

    switch (data.nodeType) {
      case Node.DOCUMENT_TYPE_NODE:
        var docType = < DocumentType > node;
        data.name = docType.name;
        data.publicId = docType.publicId;
        data.systemId = docType.systemId;
        break;

      case Node.COMMENT_NODE:
      case Node.TEXT_NODE:
        data.textContent = node.textContent;
        break;

      case Node.ELEMENT_NODE:
        var elm = < Element > node;
        data.tagName = elm.tagName;
        data.attributes = {};
        for (var i = 0; i < elm.attributes.length; i++) {
          var attr = elm.attributes[i];
          data.attributes[attr.name] = attr.value;
        }

        if (recursive && elm.childNodes.length) {
          data.childNodes = [];

          for (var child = elm.firstChild; child; child = child.nextSibling)
            data.childNodes.push(this.serializeNode(child, true));
        }
        break;
    }

    return data;
  }

  private serializeAddedAndMoved(added: Node[],
    reparented: Node[],
    reordered: Node[]): PositionData[] {
    var all = added.concat(reparented).concat(reordered);

    var parentMap = new MutationSummary.NodeMap < NodeMap < boolean >> ();

    all.forEach((node) => {
      var parent = node.parentNode;
      var children = parentMap.get(parent)
      if (!children) {
        children = new MutationSummary.NodeMap < boolean > ();
        parentMap.set(parent, children);
      }

      children.set(node, true);
    });

    var moved: PositionData[] = [];

    parentMap.keys().forEach((parent) => {
      var children = parentMap.get(parent);

      var keys = children.keys();
      while (keys.length) {
        var node = keys[0];
        while (node.previousSibling && children.has(node.previousSibling))
          node = node.previousSibling;

        while (node && children.has(node)) {
          var data = < PositionData > this.serializeNode(node);
          data.previousSibling = this.serializeNode(node.previousSibling);
          data.parentNode = this.serializeNode(node.parentNode);
          moved.push( < PositionData > data);
          children.delete(node);
          node = node.nextSibling;
        }

        var keys = children.keys();
      }
    });

    return moved;
  }

  private serializeAttributeChanges(attributeChanged: StringMap < Element[] > ): AttributeData[] {
    var map = new MutationSummary.NodeMap < AttributeData > ();

    Object.keys(attributeChanged).forEach((attrName) => {
      attributeChanged[attrName].forEach((element) => {
        var record = map.get(element);
        if (!record) {
          record = < AttributeData > this.serializeNode(element);
          record.attributes = {};
          map.set(element, record);
        }

        record.attributes[attrName] = element.getAttribute(attrName);
      });
    });

    return map.keys().map((node: Node) => {
      return map.get(node);
    });
  }

  applyChanged(summaries: Summary[]) {
    var summary: Summary = summaries[0]

    var removed: NodeData[] = summary.removed.map((node: Node) => {
      return this.serializeNode(node);
    });

    var moved: PositionData[] =
      this.serializeAddedAndMoved(summary.added,
        summary.reparented,
        summary.reordered);

    var attributes: AttributeData[] =
      this.serializeAttributeChanges(summary.attributeChanged);

    var text: TextData[] = summary.characterDataChanged.map((node: Node) => {
      var data = this.serializeNode(node);
      data.textContent = node.textContent;
      return <TextData > data;
    });

    this.mirror.applyChanged(removed, moved, attributes, text);

    summary.removed.forEach((node: Node) => {
      this.forgetNode(node);
    });
  }
}