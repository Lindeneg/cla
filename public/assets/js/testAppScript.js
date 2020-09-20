if (window.NardisGame && window.NardisIs && window.NardisFixed) {

    const game = window.NardisGame.create(['christian', 'lindeneg']);
    const fixed = window.NardisFixed;
    const is = window.NardisIs;


    const classes = {
        highlight: {
            success: {
                text: "text-success",
                button: "btn-success"
            },
            failure: {
                text: "text-danger",
                button: "bg-danger"
            },
            default: {
                text: "text-body",
                button: "btn-info"
            },
        },
        visibility: {
            hide: "hide"
        }
    };

    const events = {

        0: () => {
            if (newRoute.classList.contains(classes.visibility.hide)) {
                menuItemActiveContents.forEach(e => e === newRoute ? e.classList.remove(classes.visibility.hide) : e.classList.add(classes.visibility.hide));
                specifyAll.forEach(e => e === specifyRoute ? e.classList.remove(classes.visibility.hide) : e.classList.add(classes.visibility.hide));
                game.resetNewRoute();
                game.updateNewRoute();
                if (game.newRoute.potentialRoutes.length > 0) {
                    game.newRoute.currentRoute = game.newRoute.potentialRoutes[0];
                    game.newRoute.toCity = game.newRoute.potentialRoutes[0][fixed.potentialRoute.city];
                    update.specifyRouteCards(0);
                }   
            } else {
                menuItemActiveContents.forEach(e => e.classList.add(classes.visibility.hide));
                specifyAll.forEach(e => e.classList.add(classes.visibility.hide));
            }

        },

        1: () => {
            if (editRoute.classList.contains(classes.visibility.hide)) {
                menuItemActiveContents.forEach(e => e === editRoute ? e.classList.remove(classes.visibility.hide) : e.classList.add(classes.visibility.hide));
            } else {
                menuItemActiveContents.forEach(e => e.classList.add(classes.visibility.hide));
            }
        },

        2: () => {
            if (buildQueue.classList.contains(classes.visibility.hide)) {
                const queue = game.getCurrentPlayer().getQueue();
                menuItemActiveContents.forEach(e => e === buildQueue ? e.classList.remove(classes.visibility.hide) : e.classList.add(classes.visibility.hide));
                if (queue.length > 0) {
                    present.queue(queue);
                } else {
                    present.emptyQueue();
                }
            } else {
                menuItemActiveContents.forEach(e => e.classList.add(classes.visibility.hide));
                specifyAll.forEach(e => e.classList.add(classes.visibility.hide));
            }
        },

        3: () => {
            if (finances.classList.contains(classes.visibility.hide)) {
                const playerFinances = game.getCurrentPlayer().getCurrentFinance();
                const playerFinanceHistory = game.getCurrentPlayer().getFinanceHistory();      
                menuItemActiveContents.forEach(e => e === finances ? e.classList.remove(classes.visibility.hide) : e.classList.add(classes.visibility.hide));
                present.finances(playerFinances, playerFinanceHistory);
                
            } else {
                menuItemActiveContents.forEach(e => e.classList.add(classes.visibility.hide));
                specifyAll.forEach(e => e.classList.add(classes.visibility.hide));
            }
        },

        4: () => {
            if (upgrades.classList.contains(classes.visibility.hide)) {
                menuItemActiveContents.forEach(e => e === upgrades ? e.classList.remove(classes.visibility.hide) : e.classList.add(classes.visibility.hide));
            } else {
                menuItemActiveContents.forEach(e => e.classList.add(classes.visibility.hide));
            }
        },

        5: () => {
            if (opponents.classList.contains(classes.visibility.hide)) {
                menuItemActiveContents.forEach(e => e === opponents ? e.classList.remove(classes.visibility.hide) : e.classList.add(classes.visibility.hide));
            } else {
                menuItemActiveContents.forEach(e => e.classList.add(classes.visibility.hide));
            }

        },
        6: () => {
            menuItemActiveContents.forEach(e => e.classList.add(classes.visibility.hide));
            determine.buttonHighlight(emptyElement);
            game.endTurn();
            update.playerInfoCard();
            /*
            menuItemActiveContents.forEach(e => e.classList.add(classes.visibility.hide));
            navEntries.forEach(e => e.classList.add(classes.visibility.hide));
            determine.buttonHighlight(emptyElement);
            navPlayerInfoDiv.classList.add(classes.visibility.hide);
            rootDiv.setAttribute('style', 'height:50em;')
            loadingSpinnerBtn.classList.remove(classes.visibility.hide);
            setTimeout(() => {
                game.endTurn();
                update.playerInfoCard();
                navPlayerInfoDiv.classList.remove(classes.visibility.hide);
                navEntries.forEach(e => e.classList.remove(classes.visibility.hide));
                loadingSpinnerBtn.classList.add(classes.visibility.hide);
                rootDiv.setAttribute('style', 'height:unset;')
            }, 1000);
            */
        },
        7: () => {

        },
        nameMap: {
            0: 'newRoute',
            1: 'editRoute',
            2: 'buildQueue',
            3: 'finances',
            4: 'upgrades',
            5: 'opponents',
            6: 'endTurn',
            7: 'default'
        }
    };

    // ELEMENTS

    const emptyElement = document.createElement("empty");

    const rootDiv = document.getElementById('root-div');

    const navPlayerInfoDiv = document.getElementById('nav-and-player-info');

    const navControl = document.getElementById("nav-control");
    const navDiv = document.getElementById("nav-div");
    const navEntries = [...document.querySelectorAll(".nav-entries")];
    const playerInfoCard = [...document.querySelectorAll('.player-info-entry')];

    const loadingSpinnerBtn = document.getElementById('loading-spinner-btn');

    const newRoute = document.getElementById("new-route");

    const specifyRoute = document.getElementById("specify-route");
    const fromCityInfoCard = [...document.querySelectorAll('.from-city-card-entry')];
    const fromCityListEntry = document.getElementById('from-city-from-city');
    const fromCityDropdown = document.getElementById('from-city-dropdown');
    const toCityListEntry = document.getElementById('to-city-to-city');
    const toCityDropdown = document.getElementById('to-city-dropdown');
    const toCityInfoCard = [...document.querySelectorAll('.to-city-card-entry')];
    const specifyRouteContinue = document.getElementById('new-route-specify-route-continue');
    
    const specifyTrain = document.getElementById("specify-train");
    const specifyTrainUL = document.getElementById("specify-train-ul");
    const specifyTrainCost = document.getElementById('specify-train-current-cost');
    const specifyTrainContinue = document.getElementById('new-route-specify-train-continue');

    const specifyCargo = document.getElementById('specify-cargo');
    const specifyCargoULFormer = document.getElementById("specify-cargo-ul-former");
    const specifyCargoULLatter = document.getElementById("specify-cargo-ul-latter");
    const specifyCargoContinue = document.getElementById("new-route-specify-cargo-continue");

    const specifyConfirmation = document.getElementById('specify-confirmation');


    const specifyAll = document.querySelectorAll('.specify');

    const editRoute = document.getElementById("edit-route");
    const buildQueue = document.getElementById('build-queue');
    const finances = document.getElementById('finances');
    const upgrades = document.getElementById('upgrades');
    const opponents = document.getElementById('opponents');


    const menuItemActiveContents = [...document.querySelectorAll('.menu-item-active-div')];
    


    // BEHAVIOR

    const reduceCargoToWeight = cargo => {
        return cargo.map(e => e.getWeight()).reduce((p, v) => p + v, 0);
    }

    const getCargoCount = arr => {
        let result = [];
        if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                let index = getCargoIndex(result, arr[i]);
                if (index < 0) {
                    result.push([arr[i], 1]);
                } else {
                    result[index][1]++;
                }
            }
        }
        return result;
    }

    const getCargoIndex = (arr, target) => {
        if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i][0].isEqual(target)) {
                    return i;
                }
            }
        }
        return -1;
    }

    const getPresentableCargo = (cargo, city) => {
        let result = "";
        let total = 0;
        if (cargo.length > 0) {
            for (let i = 0; i < cargo.length; i++) {
                if (city.productInCityDemand(cargo[i][0])) {
                    let [product, count] = cargo[i];
                    let value = product.getValue() * count;
                    total += value;
                    result += `
                    <li class="list-group-item">
                        ${count}x${product.getName().toUpperCase()}
                        <span class="text-body card-span">
                            ${value}g
                        </span>
                    </li>
                    `;
                }
            }
        }
        return [result, total];
    }

    const determine = {
        playerCardHighlight: arr => {
            if (is.array(arr) && is.HTMLElements(...arr)) {
                arr.forEach(element => {
                    let value = parseInt(element.innerText);
                    if (is.number(value)) {
                        if (value > 0) {
                            element.classList.replace(
                                classes.highlight.failure.text, 
                                classes.highlight.success.text
                            );
                        } else {
                            element.classList.replace(
                                classes.highlight.success.text, 
                                classes.highlight.failure.text
                            );
                        }
                    }
                });
            }
        },
        buttonHighlight: element => {
            if (is.HTMLElements(navEntries) && is.HTMLElement(element)) {
                navEntries.forEach(item => {
                    if (!(item === element)) {
                        item.classList.replace(
                            classes.highlight.success.button,
                            classes.highlight.default.button
                        )
                    }
                });
                if (element.classList.contains(classes.highlight.success.button)) {
                    element.classList.replace(
                        classes.highlight.success.button,
                        classes.highlight.default.button
                    );
                } else {
                    element.classList.replace(
                        classes.highlight.default.button,
                        classes.highlight.success.button
                    );
                }
            }
        },
        visibility: element => {
            if (is.HTMLElement(element)) {
                if (element.classList.contains(classes.visibility.hide)) {
                    element.classList.remove(classes.visibility.hide);
                    return 1;
                } else {
                    element.classList.add(classes.visibility.hide);
                    return 0;
                }
            }
        },
        financeContents: (finance, type) => {
            let contents = [], total = 0;
            if (finance.length > 0) {
                let extraKey, extraVal;
                for (let i = 0; i < finance.length; i++) {
                    let template = "";
                    let [route, metaType] = finance[i];
                    let metaSpecifier, metaExtraKey, metaExtraVal, metaCost = 0;
                    switch(type) {
                        case fixed.finance.income:
                            let [city, cargo, from, to] = [route.getCurrentCity(), route.getCurrentCargo(), route.getFrom(), route.getTo()];
                            let cargoCount = getCargoCount(cargo);
                            [metaSpecifier, total] = getPresentableCargo(cargoCount, city);
                            console.log(city.getName())
                            cargo.forEach(e => {console.log(e.getName())})
                            if (total !== 0) {
                                extraKey = "ROUTE";
                                extraVal = from.getName().toUpperCase() + " - " + to.getName().toUpperCase();
                            }
                            break;
                        case fixed.finance.expense:
                            metaExtraKey = "ROUTE";
                            metaExtraVal = route.getFrom().getName().toUpperCase() + " - " + route.getTo().getName().toUpperCase();
                            switch(metaType) {
                                case fixed.expenseType.newRoute:
                                    metaSpecifier = "ROUTE COST";
                                    metaCost = route.getCost() + route.getTrain().getCost();
                                    break;
                                case fixed.expenseType.editRoute:
                                    metaSpecifier = "EDIT COST";
                                    metaCost = Math.round(route.getTrain().getCost() / 2);
                                    break;
                                case fixed.expenseType.maintenance:
                                    metaSpecifier = "TRAIN UPKEEP";
                                    metaCost = route.getTrain().getMaintenance();
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            metaSpecifier = "", metaExtraKey = "", metaExtraVal = "";
                            break;
                    }
                    total += metaCost;
                    if (total !== 0) {
                        template += `
                        <li class="list-group-item bg-secondary text-light">
                            TYPE
                            <span class="text-light card-span">
                                ${fixed.financeTypeNameMap[metaType]}
                            </span>
                        </li>
                        `;
                        if (metaSpecifier && metaCost) {
                            template += `
                            <li class="list-group-item">
                                ${metaSpecifier}
                                <span class="text-body card-span">
                                    ${metaCost}g
                                </span>
                            </li>
                            `;
                        }
                        if (metaSpecifier && !(metaCost)) {
                            template += metaSpecifier;
                        }
                        if (metaExtraKey && metaExtraVal) {
                            template += `
                            <li class="list-group-item">
                                ${metaExtraKey}
                                <span class="text-body card-span">
                                    ${metaExtraVal}
                                </span>
                            </li>
                            `;
                        }
                        contents.push(template);
                    }
                }
                if (extraKey && extraVal) {
                    let template = `
                    <li class="list-group-item">
                        ${extraKey}
                        <span class="text-body card-span">
                            ${extraVal}
                        </span>
                    </li>
                    `;
                    contents.push(template);
                }
                if (total > 0) {
                    let temp = `
                    <li class="list-group-item bg-info text-light">
                        TOTAL
                        <span class="text-light card-span">
                            ${total}g
                        </span>
                    </li>
                    `;
                    contents.push(temp);
                }
            }
            total = type === fixed.finance.income ? total : total * -1;
            return [contents, total];
        }
    };

    const update = {
        playerInfoCard: () => {
            if (is.HTMLElements(...playerInfoCard)) {
                const [name, turn, routes, gold, income, expense] = playerInfoCard;
                const player = game.getCurrentPlayer();
    
                name.innerText = player.getName();
                turn.innerText = player.getTotalTurns();
                routes.innerText = player.getRoutes().length;
                gold.innerText = player.getGold();
                income.innerText = 0; // TODO
                expense.innerText = 0; // TODO
    
                determine.playerCardHighlight([gold, income, expense]);
            }
        },
        innerText: (elements, contents) => {
            if (is.array(elements) && is.HTMLElements(...elements) && is.array(contents) && elements.length === contents.length) {
                for (let i = 0; i < elements.length; i++) {
                    elements[i].innerHTML = contents[i];
                }
            }
        },
        specifyRouteCards: index => {
            if (is.HTMLElements(...[...fromCityInfoCard, ...toCityInfoCard])) {
                let fromContents = [
                    game.newRoute.fromCity.getName(), 
                    game.newRoute.fromCity.getCurrentRoutesCount(), 
                    game.newRoute.fromCity.getMaxCurrentRoutes(), 
                    game.newRoute.fromCity.getSize(), 
                    game.newRoute.fromCity.isStartCity ? 'Yes' : 'No',
                    present.productArray(game.newRoute.fromCity.getSupply(), fixed.productType.supply), 
                    present.productArray(game.newRoute.fromCity.getDemand(), fixed.productType.demand)
                ];
                let toContents = [
                    game.newRoute.potentialRoutes[index][fixed.potentialRoute.city].getName(),
                    game.newRoute.potentialRoutes[index][fixed.potentialRoute.city].getCurrentRoutesCount(),
                    `${game.newRoute.potentialRoutes[index][fixed.potentialRoute.distance]}km`,
                    `${game.newRoute.potentialRoutes[index][fixed.potentialRoute.goldCost]}g`,
                    `${game.newRoute.potentialRoutes[index][fixed.potentialRoute.turnCost]}t`,
                    present.productArray(
                        game.newRoute.potentialRoutes[index][fixed.potentialRoute.city].getSupply(), 
                        fixed.productType.supply
                    ),
                    present.productArray(
                        game.newRoute.potentialRoutes[index][fixed.potentialRoute.city].getDemand(),
                        fixed.productType.demand    
                    )
                ];
                update.innerText(fromCityInfoCard, fromContents);
                update.innerText(toCityInfoCard, toContents);
            }
        }
    }

    const present = {
        productArray: (arr, productType, classNames) => {
            if (is.array(arr) && is.number(productType)) {
                let label;
                switch(productType) {
                    case fixed.productType.supply:
                        label = "Supply";
                        break;
                    case fixed.productType.demand:
                        label = "Demand";
                        break;
                    case fixed.productType.cargo:
                        label = "Current Cargo";
                        break;
                    default:
                        label = "";
                        break;
                }
                let result = `
                <li class="list-group-item bg-secondary text-light">
                    ${label}
                </li>
                `;
                if (productType === fixed.productType.cargo && arr.length <= 0) {
                    return `
                    <li class="list-group-item">
                        No Cargo
                    </li>    
                    `;
                }
                for (let i = 0; i < arr.length; i++) {
                    let product = arr[i];
                    result += `
                        <li index=${i} class="list-group-item ${classNames ? classNames : ""}">
                            ${product.getName()}
                            <span class="card-span product-span">
                                Value : ${product.getValue()}g ||
                                Weight: ${product.getWeight()}u
                            </span>
                        </li>                   
                    `;
                }
                return result;
            } else {
                return arr;
            }
        },
        purchaseableTrains: () => {
            const trains = game.getTrains();
            const baseClass = 'list-group-item';
            let content = "";
            for (let i = 0; i < trains.length; i++) {
                let train = trains[i];
                if (game.newRoute.currentRoute[fixed.potentialRoute.goldCost] + train.getCost() <= game.getCurrentPlayer().getGold()) {
                    content += `
                    <li id="specify-train-entry" index=${i} class="${baseClass} bg-dark text-light">
                        Name
                        <span class="text-light card-span">
                            ${train.getName()}
                        </span>
                    </li>
                    <li class="${baseClass}">
                        Cost
                        <span class="text-body card-span">
                            ${train.getCost()}g
                        </span>
                    </li>
                    <li class="${baseClass}">
                        Maintenance
                        <span class="text-body card-span">
                            ${train.getMaintenance()}g/t
                        </span>
                    </li>
                    <li class="${baseClass}">
                        Speed
                        <span class="text-body card-span">
                            ${train.getSpeed()}km/t
                        </span>
                    </li>
                    <li class="${baseClass}">
                        Cargo Space
                        <span class="text-body card-span">
                            ${train.getCargoSpace()}u
                        </span>
                    </li>
                    `;
                }
            }
            if (content === "") {
                present.cannotAffordAnyTrains();
            } else {
                specifyTrainUL.innerHTML = content;
                const presentableTrains = specifyTrainUL.querySelectorAll('#specify-train-entry');
                presentableTrains.forEach(train => {
                    train.addEventListener('click', e => {
                        e = e.target;
                        let index = e.getAttribute('index');
                        if (!(index)) {
                            e = e.parentElement;
                            index = e.getAttribute('index');
                        }
                        let actualTrain = game.getTrains()[index];
                        game.newRoute.train = actualTrain;
                        let cost = actualTrain.getCost();
                        specifyTrainCost.innerText = game.newRoute.currentRoute[fixed.potentialRoute.goldCost] + cost + 'g';
                        e.classList.replace('bg-dark', 'bg-success');
                        presentableTrains.forEach(pt => {
                            if (!(pt === e)) {
                                pt.classList.replace('bg-success', 'bg-dark');
                            }
                        });
                    });
                });
            }
        },
        addCargoToRouteTemplate: cargoType => {
            const { fromCity, toCity, train } = game.newRoute;
            const baseClass = 'list-group-item';
            const isFrom = cargoType === fixed.cargo.from;
            const initialCity = isFrom ? fromCity : toCity;
            const subCity = isFrom ? toCity : fromCity;
            const cargo = isFrom ? game.newRoute.fromCargo : game.newRoute.toCargo;
            return (
                `
                    <li id="" class="${baseClass} bg-dark text-light text-center">
                        <span class="text-light">
                            FROM ${initialCity.getName().toUpperCase()}
                        </span>
                    </li>
                    ${present.productArray(initialCity.getSupply(), fixed.productType.supply, 'specify-cargo-entry')}
                    <li id="" class="${baseClass} bg-dark text-light text-center">
                        <span class="text-light">
                            TO ${subCity.getName().toUpperCase()}
                        </span>
                    </li>
                    ${present.productArray(subCity.getDemand(), fixed.productType.demand)}
                    <li id="" class="${baseClass} bg-dark text-light text-center">
                        CARGO SPACE LEFT:
                        <span class="text-light">
                        ${train.getCargoSpace() - reduceCargoToWeight(cargo)} 
                        </span>
                    </li>
                    ${present.productArray(cargo, fixed.productType.cargo, 'specified-cargo-entry')}
                `
            );
        },
        addCargoToRoute: () => {
            const fromTemplate = present.addCargoToRouteTemplate(fixed.cargo.from);
            const toTemplate = present.addCargoToRouteTemplate(fixed.cargo.to);
            const listeners = [
                [specifyCargoULFormer, '.specify-cargo-entry', game.newRoute.fromCargo, handleAddToRouteCargo], 
                [specifyCargoULFormer, '.specified-cargo-entry', game.newRoute.fromCargo, handleDeleteFromRouteCargo], 
                [specifyCargoULLatter, '.specify-cargo-entry', game.newRoute.toCargo, handleAddToRouteCargo], 
                [specifyCargoULLatter, '.specified-cargo-entry', game.newRoute.toCargo, handleDeleteFromRouteCargo]
            ];

            specifyCargoULFormer.innerHTML = fromTemplate;
            specifyCargoULLatter.innerHTML = toTemplate;

            listeners.forEach(listener => {
                let [el, sel, arr, func] = listener;
                el.querySelectorAll(sel).forEach(e => {
                    e.addEventListener('click', event => {
                        func(event.target, arr);
                    });
                });
            });
        },
        finalNewRouteOverview: () => {
            const { fromCity, toCity, train, currentRoute} = game.newRoute;
            return (`
            <ul id="" class="list-group selection-list ul-largest">
                <li id="" class="list-group-item bg-dark text-light">
                    NEW ROUTE
                </li>
                <li class="list-group-item">
                    FROM
                    <span class="text-body card-span">
                        ${fromCity.getName().toUpperCase()}
                    </span>
                </li>
                <li class="list-group-item">
                    TO
                    <span class="text-body card-span">
                        ${toCity.getName().toUpperCase()}
                    </span>
                </li>
                <li class="list-group-item">
                    DISTANCE
                    <span class="text-body card-span">
                        ${currentRoute[fixed.potentialRoute.distance]}km
                    </span>
                </li>
                <li class="list-group-item">
                    TRAIN SPEED
                    <span class="text-body card-span">
                        ${train.getSpeed()}km/t
                    </span>
                </li>
                <li class="list-group-item">
                    GOLD COST
                    <span class="text-body card-span">
                        ${currentRoute[fixed.potentialRoute.goldCost] + train.getCost()}g
                    </span>
                </li>
                <li class="list-group-item">
                    TURN COST
                    <span class="text-body card-span">
                        ${currentRoute[fixed.potentialRoute.turnCost]}t
                    </span>
                </li>
                <li class="list-group-item">
                    MAINTENANCE
                    <span class="text-body card-span">
                        ${train.getMaintenance()}g/t
                    </span>
                </li>
                <button type="button" class="btn btn-danger btn-lg text-light final-btn">
                    Add Route To Queue
                </button>
            </ul>
            `);
        },
        emptyQueue: () => {
            buildQueue.innerHTML = `
            <div id="active-build-queue">
                <ul class="list-group selection-list ul-largest">
                    <li class="list-group-item" >
                        YOUR BUILD QUEUE IS EMPTY
                    </li>
                </ul>
            </div>
            `;
        },
        queue: queue => {
            let listEntries = "";
            for (let i = 0; i < queue.length; i++) {
                let currentEntry = queue[i];
                listEntries += `
                <li id="queue-list-entry" index=${i} class="list-group-item bg-dark text-light">
                    ROUTE
                </li>
                <li class="list-group-item" >
                    ${currentEntry[fixed.queue.route].getFrom().getName()} 
                    <span class="text-body card-span">
                        ${currentEntry[fixed.queue.route].getTo().getName()}
                    </span>
                </li>
                <li class="list-group-item" >
                    Train
                    <span class="text-body card-span">
                        ${currentEntry[fixed.queue.route].getTrain().getName()}
                    </span>
                </li>
                <li class="list-group-item" >
                    Turns Left
                    <span class="text-body card-span">
                        ${currentEntry[fixed.queue.turnCost]}
                    </span>
                </li>
                `;
            }
            buildQueue.innerHTML = `
            <div id="active-build-queue">
                <ul class="list-group selection-list ul-largest">
                    ${listEntries}
                </ul>
            </div>
            `;
            const deleteDivs = buildQueue.querySelectorAll('#queue-list-entry');
            if (deleteDivs.length > 0) {
                for (let i = 0; i < deleteDivs.length; i++) {
                    deleteDivs[i].addEventListener('click', e => {
                        const index = e.target.getAttribute('index');
                        const player = game.getCurrentPlayer();
                        const queuedItem = game.getCurrentPlayer().getQueue()[index];
                        game.removeRouteFromPlayerQueue(queuedItem);
                        update.playerInfoCard();
                        const queue = player.getQueue();
                        if (queue.length > 0) {
                            present.queue(queue);
                        } else {
                            present.emptyQueue();
                        }
                    });
                }
            }
        },
        cannotAffordAnyTrains: () => {
            specifyTrainUL.innerHTML = `
            <li class="list-group-item bg-dark text-light">
                YOU CANNOT AFFORD ANY TRAINS WITH THIS ROUTE
            </li>
            `;
            specifyTrainContinue.addEventListener('click', () => {
                determine.buttonHighlight(emptyElement);
                menuItemActiveContents.forEach(e => e.classList.add(classes.visibility.hide));
            }, {once: true});
        },
        noFinance: () => {
            finances.innerHTML = `
            <div id="active-finances">
                <ul class="list-group selection-list ul-largest">
                    <li class="list-group-item">
                        NO FINANCE INFO AVAILABLE
                    </li>
                </ul>
            </div>
            `;
        },
        finances: (current, history) => {
            const income = [], expense = [];
            const objects = [
                [income, current[fixed.finance.income], fixed.finance.income],
                [expense, current[fixed.finance.expense], fixed.finance.expense]
            ];
            let total = 0;
            for (let i = 0; i < objects.length; i++) {
                let [arr, obj, type] = objects[i];
                let content = determine.financeContents(obj, type)
                total += content[1];
                content[0].length > 0 ? arr.push(content[0]) : null;
            }
            let template = `    
            <div id="active-finances">
                <ul class="list-group selection-list ul-largest">
                    <li class="list-group-item bg-primary text-light">
                        TURN 
                        <span class="text-light card-span">
                            ${current[fixed.finance.turn]}
                        </span>
                        <div id="finance-turn-dropdown" class="dropdown-content">
                        </div>
                    </li>
                    <li class="list-group-item bg-dark text-light">
                        INCOME
                    </li>
                    ${income.length > 0 ? income.join('\n') : '<li class="list-group-item">NO INCOME</li>'}
                    <li class="list-group-item bg-dark text-light">
                        EXPENSE
                    </li>
                    ${expense.length > 0 ? expense.join('\n') : '<li class="list-group-item">NO EXPENSE</li>'}
                    <li class="list-group-item bg-dark text-light ">
                        PROFIT
                        <li class="list-group-item text-light ${total > 0 ? 'bg-success' : 'bg-danger'}">
                            TOTAL 
                            <span class="text-light card-span">
                                ${total}g
                            </span>
                        </li>
                    </li>
                </ul>
            </div>
            `.replace(/,/g, '');
            finances.innerHTML = template;
            const primary =  finances.querySelector('.bg-primary');
            const dropdown = finances.querySelector('#finance-turn-dropdown');
            primary.id = 'finance-turn';
            primary.addEventListener('mouseenter', handleTurnFinanceList.bind(null, history, dropdown, current[fixed.finance.turn]));
            primary.addEventListener('mouseleave', handleEmptyDropdown.bind(null, dropdown));
    
        }
    };


    // EVENT HANDLERS

    const handleEmptyDropdown = obj => {
        if (is.HTMLElement(obj)) {
            obj.innerHTML = '';
        }
    }

    const handleNewRouteConfirmation = () => {
        specifyAll.forEach(e => e === specifyConfirmation ? e.classList.remove(classes.visibility.hide) : e.classList.add(classes.visibility.hide));
        specifyConfirmation.innerHTML = present.finalNewRouteOverview();
        specifyConfirmation.querySelector('button').addEventListener('click', () => {
            game.addRouteToPlayerQueue();
            update.playerInfoCard();
            game.resetNewRoute();
            determine.visibility(newRoute);
            determine.buttonHighlight(emptyElement);
        });
    }

    const handleDeleteFromRouteCargo = (el, target) => {
        let index = el.getAttribute('index');
        if (!(index)) {
            el = el.parentElement;
            index = el.getAttribute('index');
        }
        target.splice(index, 1);
        present.addCargoToRoute();
    }

    const handleAddToRouteCargo = (el, target) => {
        const { fromCity, toCity, train } = game.newRoute;
        const isFrom = target === game.newRoute.fromCargo;
        const arr = isFrom ? fromCity.getSupply() : toCity.getSupply();

        let index = el.getAttribute('index');
        if (!(index)) {
            el = el.parentElement;
            index = el.getAttribute('index');
        }
        let product = arr[index];
        if (reduceCargoToWeight(target) + product.getWeight() <= train.getCargoSpace()) {
            target.push(product);
        }
        present.addCargoToRoute();
    }

    const handleNavControlClick = () => { 
        determine.visibility(navDiv) ? navControl.innerText = "Hide Menu" : navControl.innerText = "Show Menu";

    }

    const handleMenuItemClick = (item, items, eventCallback) => {
        if (is.HTMLElement(item) && is.array(items) && is.function(eventCallback)) {
            determine.buttonHighlight(item, items);
            eventCallback();
        }
    }

    const handleToCityList = () => {
        if (toCityDropdown.innerHTML.trim() === "" && game.newRoute.potentialRoutes.length > 0) {
            for (let i = 0; i < game.newRoute.potentialRoutes.length; i++) {
                let potentialCity = game.newRoute.potentialRoutes[i][fixed.potentialRoute.city];
                let el = document.createElement('a');
                el.className = 'to-city-dropdown-entry';
                el.setAttribute('index', i);
                if (potentialCity.isEqual(game.newRoute.toCity)) {
                    el.setAttribute('style', 'background-color: #17a2b8 !important;')
                }
                el.innerText = potentialCity.getName();
                el.addEventListener('click', handleToCityListEntry);
                toCityDropdown.appendChild(el);
            }
        } else {
            toCityDropdown.innerHTML = "";
        }
    }

    const handleFromCityList = () => {
        if (fromCityDropdown.innerHTML.trim() === "" && game.newRoute.routedCities.length > 0) {
            for (let i = 0; i < game.newRoute.routedCities.length; i++) {
                let potentialCity = game.newRoute.routedCities[i];
                let el = document.createElement('a');
                el.className = 'to-city-dropdown-entry';
                el.setAttribute('index', i);
                if (potentialCity.isEqual(game.newRoute.fromCity)) {
                    el.setAttribute('style', 'background-color: #17a2b8 !important;')
                }
                el.innerText = potentialCity.getName();
                el.addEventListener('click', handleFromCityListEntry);
                fromCityDropdown.appendChild(el);
            }
        } else {
            fromCityDropdown.innerHTML = "";
        }
    }

    const handleTurnFinanceList = (history, dropdown, turn) => {
        let metaHistory = [...history, game.getCurrentPlayer().getCurrentFinance()];
        if (dropdown.innerHTML.trim() === "" && metaHistory.length > 0) {
            for (let i = 0; i < metaHistory.length; i++) {
                let el = document.createElement('a');
                let actualTurn = i + 1;
                el.className = 'to-city-dropdown-entry';
                el.setAttribute('index', i);
                if (actualTurn === turn) {
                    el.setAttribute('style', 'background-color: #17a2b8 !important;')
                }
                el.innerText = `TURN #${actualTurn}`;
                el.addEventListener('click', handleTurnFinanceListEntry);
                dropdown.appendChild(el);
            }
        } else {
            dropdown.innerHTML = "";
        }
    }

    const handleTurnFinanceListEntry = event => {
        const history = game.getCurrentPlayer().getFinanceHistory();
        const index = event.target.getAttribute('index');
        let obj = history[index] ? history[index] : game.getCurrentPlayer().getCurrentFinance();
        present.finances(obj, history);
    }

    const handleToCityListEntry = event => {
        const index = event.target.getAttribute('index');
        game.newRoute.currentRoute = game.newRoute.potentialRoutes[index];
        game.newRoute.toCity = game.newRoute.potentialRoutes[index][fixed.potentialRoute.city];
        game.newRoute.potentialRoutes = game.getPlayerPotentialRoutes();
        update.specifyRouteCards(index);
    }

    const handleFromCityListEntry = event => {
        let index = event.target.getAttribute('index');
        game.newRoute.fromCity = game.newRoute.routedCities[index];
        game.newRoute.potentialRoutes = game.getPlayerPotentialRoutes();
        if (game.newRoute.potentialRoutes.length > 0) {
            for (let i = 0; i < game.newRoute.potentialRoutes.length; i++) {
                let route = game.newRoute.potentialRoutes[i][fixed.potentialRoute.city];
                if (route.isEqual(game.newRoute.toCity)) {
                    index = i;
                }
            }
        }
        update.specifyRouteCards(index);
    }

    const handleSpecifyRouteContinue = () => {
        specifyAll.forEach(e => e === specifyTrain ? e.classList.remove(classes.visibility.hide) : e.classList.add(classes.visibility.hide));
        specifyTrainCost.innerText = game.newRoute.currentRoute[fixed.potentialRoute.goldCost] + 'g';
        present.purchaseableTrains();
    }

    const handleSpecifyTrainContinue = () => {
        document.querySelectorAll('#specify-train-entry').forEach(e => {
            if (e.classList.contains('bg-success')) {
                specifyAll.forEach(e => e === specifyCargo ? e.classList.remove(classes.visibility.hide) : e.classList.add(classes.visibility.hide));
                present.addCargoToRoute();
            }
        });
    }

    // EVENT LISTENERS

    navControl.addEventListener("click", handleNavControlClick); 
    toCityListEntry.addEventListener('mouseenter', handleToCityList);
    toCityListEntry.addEventListener('mouseleave', handleEmptyDropdown.bind(null, toCityDropdown));
    fromCityListEntry.addEventListener('mouseenter', handleFromCityList);
    fromCityListEntry.addEventListener('mouseleave', handleEmptyDropdown.bind(null, fromCityDropdown));
    specifyRouteContinue.addEventListener('click', handleSpecifyRouteContinue);
    specifyTrainContinue.addEventListener('click', handleSpecifyTrainContinue);
    specifyCargoContinue.addEventListener('click', handleNewRouteConfirmation);

    navEntries.forEach(menuItem => {
        const eventCallback = events[menuItem.getAttribute("event")];
        menuItem.addEventListener("click", () => {
            handleMenuItemClick(menuItem, navEntries, eventCallback);
        });
    });

    update.playerInfoCard();


}