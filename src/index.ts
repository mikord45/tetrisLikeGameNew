import { Main, Directions } from "./main";
import { Field } from "./pole";

interface Vertex {
    row: number;
    col: number;
    id: number;
    filled: boolean;
    len: number;
    from: number
}

let main = new Main()

let table: HTMLTableElement = <HTMLTableElement>document.getElementById("emptyTable")
for (let i: number = 0; i < 9; i++) {
    let row = table.insertRow(i)
    for (let j: number = 0; j < 9; j++) {
        let cell = row.insertCell(j)
        let id: number = i * 9 + j
        let strId: string = id.toString()
        cell.setAttribute("id", strId)
        let field: Field = new Field(j, i, id, false, cell) ///uwaga
        main.tabOfFields.push(field)
        // cell.innerText = ((i * 9) + j).toString()
        cell.addEventListener("click", function () {
            if (main.getLoseStatus() == false && main.getCurrentMovingStatus() == false) {
                let idToFind = this.id
                if (main.tabOfFields[id].getFilled() == true) { //czy w polu jest kulka
                    main.tabOfAllBalls.map(function (elem) {
                        // console.log(elem.getIdOfField().toString(), idToFind)
                        if (elem.getIdOfField().toString() == idToFind) {
                            // console.log(elem.getClickedInfo())
                            if (elem.getClickedInfo() == false) { //czy pole jest klikniete
                                if (main.getSthClicked() == false) { //czy jest kliknieta inna kulka
                                    // console.log("?????")
                                    elem.changeClicked()
                                    elem.makeBiggerBall()
                                    main.changeSthClicked()
                                    main.assignCurrentClick(elem)
                                    main.setIdOfPreviousField(parseInt(idToFind))
                                }
                                else { //jezeli pole  ma kulke, nie jest klikniete, ale jest kliknieta inna kulka
                                    // console.log("!!!!")
                                    elem.changeClicked()
                                    elem.makeBiggerBall()
                                    // main.changeSthClicked()
                                    main.getCurrentClicked().changeClicked()
                                    main.getCurrentClicked().makeSmallerBall()
                                    main.assignCurrentClick(elem)
                                    main.setIdOfPreviousField(parseInt(idToFind))
                                }
                            }
                            else { //jezeli pole ma kulke i bylo juz klikniete
                                // console.log("|||||")
                                main.resetCurrentClicked()
                                main.changeSthClicked()
                                elem.changeClicked()
                                elem.makeSmallerBall()
                            }
                        }
                    })
                }
                else { //nie ma kulki
                    if (main.getSthClicked() == true) { //ale jakas inna kulka jest kliknieta
                        main.tabOfUnVisited = []
                        main.tabOfAllVertexes = []
                        main.tabOfVisited = []
                        //utworzenie vertexów, na wszystkie pola 
                        for (let i: number = 0; i < main.tabOfFields.length; i++) {
                            let now: Vertex = {
                                row: main.tabOfFields[i].getRow(),
                                col: main.tabOfFields[i].getCol(),
                                id: main.tabOfFields[i].getId(),
                                filled: main.tabOfFields[i].getFilled(),
                                len: null,
                                from: null
                            }
                            main.tabOfAllVertexes.push(now)
                            main.tabOfUnVisited.push(now)
                        }
                        // console.log(main.tabOfAllVertexes[main.getCurrentClicked().getIdOfField()])
                        // main.tabOfVisited.push(firstVertex)

                        // for(let i:number=0; i<main.tabOfAllVertexes.length; i++){
                        //     if(main.tabOfAllVertexes[i].filled == true){
                        //         main.tabOfVisited.push(main.tabOfAllVertexes[i])
                        //     }
                        // }
                        // console.log(main)

                        //usunięcie vertxów z zajętych pól
                        main.tabOfUnVisited = main.tabOfUnVisited.filter(function (elem) {
                            if (elem.filled == false) {
                                return (elem)
                            }
                        })
                        let count: number = 0
                        while (main.tabOfUnVisited.length > 0) {
                            // console.log("raz")

                            //pętla, gdy istnieją nieodwiedzone vertexy
                            let nowVertex: Vertex

                            //znajdź element, z najmniejszą drogą od punktu docelowego, spośród wszystkich nieodwiedzonych vertexów
                            if (main.tabOfVisited.length == 0) {
                                nowVertex = main.tabOfAllVertexes[main.getCurrentClicked().getIdOfField()]
                                main.tabOfAllVertexes[main.getCurrentClicked().getIdOfField()].len = 0
                                main.tabOfUnVisited.push(nowVertex)
                            }
                            else {
                                let smallestLen: number
                                for (let i: number = 0; i < main.tabOfUnVisited.length; i++) {
                                    if (i == 0) {
                                        if (main.tabOfUnVisited[i].len == null) {
                                            smallestLen = 10000
                                        }
                                        else {
                                            smallestLen = main.tabOfUnVisited[i].len
                                        }
                                    }
                                    // else if (main.tabOfUnVisited[i].len == null) {
                                    //     console.log("ok")
                                    //     // main.changeValueOfEndingPathFinding()
                                    //     // break
                                    // }
                                    else if (main.tabOfUnVisited[i].len < smallestLen && main.tabOfUnVisited[i].len != null) {
                                        smallestLen = main.tabOfUnVisited[i].len
                                    }
                                }
                                let nowVertexTab: Vertex[] = main.tabOfUnVisited.filter(function (elem) {
                                    if (elem.len == smallestLen) {
                                        return (elem)
                                    }
                                })
                                nowVertex = nowVertexTab[0]
                                if (nowVertex == undefined) {
                                    // main.changeValueOfEndingPathFinding()
                                    break
                                }
                                // console.log("----")
                                // console.log(smallestLen)
                                // console.log("------")

                            }
                            // console.log(main.tabOfUnVisited)
                            // console.log(nowVertex)

                            //sprawdzanie czy vertexy prawo-lewo-gora-dol nie "przeskakuja" do innych wierszy i czy wgl istnieja
                            let possibleDirections: Directions = main.findPossibleVertexes(nowVertex)
                            let tabOfNowVertexes: Vertex[] = []
                            if (possibleDirections.up == true) {
                                let properVertexHelper: Vertex[] = main.tabOfAllVertexes.filter(function (elem) {
                                    if (elem.id == nowVertex.id - 9) {
                                        return (elem)
                                    }

                                })
                                let properVertex: Vertex = properVertexHelper[0]
                                tabOfNowVertexes.push(properVertex)
                            }
                            if (possibleDirections.down == true) {
                                let properVertexHelper: Vertex[] = main.tabOfAllVertexes.filter(function (elem) {
                                    if (elem.id == nowVertex.id + 9) {
                                        return (elem)
                                    }

                                })
                                let properVertex: Vertex = properVertexHelper[0]
                                tabOfNowVertexes.push(properVertex)
                            }
                            if (possibleDirections.left == true) {
                                let properVertexHelper: Vertex[] = main.tabOfAllVertexes.filter(function (elem) {
                                    if (elem.id == nowVertex.id - 1) {
                                        return (elem)
                                    }

                                })
                                let properVertex: Vertex = properVertexHelper[0]
                                tabOfNowVertexes.push(properVertex)
                            }
                            if (possibleDirections.right == true) {
                                let properVertexHelper: Vertex[] = main.tabOfAllVertexes.filter(function (elem) {
                                    if (elem.id == nowVertex.id + 1) {
                                        return (elem)
                                    }

                                })
                                let properVertex: Vertex = properVertexHelper[0]
                                tabOfNowVertexes.push(properVertex)
                            }
                            //sprawdzasz czy sasiednie vertexy sa puste czy zajete
                            tabOfNowVertexes = tabOfNowVertexes.filter(function (elem) {
                                if (elem.filled == false) {
                                    return (elem)
                                }
                            })
                            // console.log(tabOfNowVertexes)
                            //wykonujesz aktualizacje odleglosci i sciezek zgodnie z algorytmem dijsktry
                            for (let i: number = 0; i < tabOfNowVertexes.length; i++) {
                                if (tabOfNowVertexes[i].len == null) {
                                    tabOfNowVertexes[i].len = nowVertex.len + 1
                                    tabOfNowVertexes[i].from = nowVertex.id
                                    main.tabOfAllVertexes[tabOfNowVertexes[i].id] = tabOfNowVertexes[i]
                                }
                                else if (tabOfNowVertexes[i].len > nowVertex.len + 1) { //zeby doszlo do aktualizacji sciezki musi byc ona lepsza niz aktualna
                                    tabOfNowVertexes[i].len = nowVertex.len + 1
                                    tabOfNowVertexes[i].from = nowVertex.id
                                    main.tabOfAllVertexes[tabOfNowVertexes[i].id] = tabOfNowVertexes[i]
                                }
                            }
                            //przesuwanie pomiedzy odwiedzonymi a nieodwiedzonymi
                            let properI: number = null
                            let vertexToDelTab: Vertex[] = main.tabOfUnVisited.filter(function (elem, i) { //szukanie vertexa, ktorego skonczylismy sprawdzac
                                if (elem.id == nowVertex.id) {
                                    if (properI == null) {
                                        properI = i
                                    }
                                    return (elem)

                                }
                            })
                            let vertexToDel: Vertex = vertexToDelTab[0] 
                            if (vertexToDel != undefined) {
                                main.tabOfUnVisited.splice(properI, 1)
                                main.tabOfVisited.push(vertexToDel)
                            }
                            count += 1
                        }
                        // if(main.getValueOfEndingPathFinding() == false){
                        main.createPath(main.tabOfAllVertexes, id)
                        // setTimeout(function () {
                        //     console.log("ZZZZZZZZZZ")
                        //     if (main.getCurrentClicked() != undefined) {
                        //         // if(main.getValueOfEndingPathFinding() == false){
                        //             main.getCurrentClicked().changeClicked()
                        //             main.getCurrentClicked().makeSmallerBall()
                        //             main.getCurrentClicked().changeField(id)
                        //             let col: number = id % 9
                        //             let row: number = Math.floor(id / 9)
                        //             main.getCurrentClicked().changeCol(col)
                        //             main.getCurrentClicked().changeRow(row)
                        //             main.tabOfFields[id].cell.appendChild(main.getCurrentClicked().getDiv())
                        //             main.tabOfFields[id].changeFilled()
                        //             main.tabOfFields[main.getIdOfPreviousField()].changeFilled()
                        //             main.resetCurrentClicked()
                        //             main.changeSthClicked()
                        //             main.nextMove()
                        //         // }
                        //         // else{
                        //         //     console.log("zmiana")
                        //         //     // main.changeValueOfEndingPathFinding()
                        //         // }
                        //     }
                        // }, 750)
                        // }
                        // else{
                        //     main.changeValueOfEndingPathFinding()
                        //     console.log("nie da sie tu ruszyc")
                        // }

                        // console.log("zrobione")
                        // console.log(main)
                        ///////////////////////////////

                    }
                }
            }
        })
    }
}
main.currentColors = main.add()
main.lottery()
main.nextMove()

export { Vertex }
