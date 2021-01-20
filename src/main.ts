import { Field } from "./pole";
import { Ball } from "./kula";
import { Vertex } from "./index"
import { before, Function } from "lodash";

interface Directions {
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean,
    change: (direction: string) => void
}

class Main {
    private currentClicked: Ball
    private clickingAvailable: boolean
    tabOfFields: Field[]
    currentColors: string[]
    private CurrentIdOfLastBall: number
    tabOfNextBalls: Ball[]
    tabOfAllBalls: Ball[]
    private sthClicked: boolean
    private idOfPreviousField: number
    tabOfAllVertexes: Vertex[]
    tabOfVisited: Vertex[]
    tabOfUnVisited: Vertex[]
    private lastElem: Vertex
    private endPathFinding: boolean
    tabOfCurrentIdsToDel: number[]
    private score: number
    private lostGame: boolean
    private currentMoving: boolean

    constructor() {
        this.currentClicked = null
        this.clickingAvailable = true
        this.tabOfFields = []
        this.currentColors = []
        this.CurrentIdOfLastBall = 100
        this.tabOfNextBalls = []
        this.tabOfAllBalls = []
        this.sthClicked = false
        this.tabOfAllVertexes = []
        this.tabOfVisited = []
        this.tabOfUnVisited = []
        this.lastElem = null
        this.endPathFinding = false
        this.tabOfCurrentIdsToDel = []
        this.score = 0
        this.lostGame = false
        this.currentMoving = false
    }

    changeCurrentMovingStatus(): void {
        this.currentMoving = !this.currentMoving
    }

    getCurrentMovingStatus(): boolean {
        return (this.currentMoving)
    }

    getLoseStatus(): boolean {
        return (this.lostGame)
    }

    lose(): void {
        this.lostGame = true
    }

    addScore(pts: number): void {
        this.score += pts
    }

    getScore(): number {
        return (this.score)
    }

    resetTabOfCurrentIdsToDel(): void {
        this.tabOfCurrentIdsToDel = []
    }

    getValueOfEndingPathFinding(): boolean {
        return (this.endPathFinding)
    }

    changeValueOfEndingPathFinding(): void {
        this.endPathFinding = !this.endPathFinding
        // console.log(this.endPathFinding)
    }

    getIdOfPreviousField(): number {
        return (this.idOfPreviousField)
    }

    setIdOfPreviousField(id: number): void {
        this.idOfPreviousField = id
    }

    resetCurrentClicked(): void {
        this.currentClicked = null
    }


    getCurrentClicked(): Ball {
        return (this.currentClicked)
    }

    assignCurrentClick(ball: Ball): void {
        this.currentClicked = ball
    }

    getSthClicked(): boolean {
        return (this.sthClicked)
    }

    changeSthClicked(): void {
        this.sthClicked = !this.sthClicked
    }

    clearTableOfNextBalls(): void {
        this.tabOfNextBalls = []
    }

    //dotad obsluga privatow itd

    add(): string[] {
        let colors: string[] = ["pink", "red", "blue", "green", "yellow", "orange", "grey"] //////////////////
        let selected: string[] = []
        for (let i: number = 0; i < 3; i++) {
            let now: number = Math.floor(Math.random() * 7) /////////////////
            let now2: string = colors[now]
            selected.push(now2)
        }
        return selected
    }

    lottery(): void {
        let table: HTMLTableElement = <HTMLTableElement>document.getElementById("tableToShow")
        let row = table.insertRow(0)
        row.setAttribute("id", "next")
        for (let i: number = 0; i < 3; i++) {
            let cell = row.insertCell(i)
            let elem: HTMLDivElement = <HTMLDivElement>document.createElement("div")
            elem.style.backgroundColor = this.currentColors[i]
            elem.setAttribute("class", "ball")
            elem.setAttribute("id", this.CurrentIdOfLastBall.toString())
            cell.appendChild(elem)
            let ball: Ball = new Ball(null, null, null, this.CurrentIdOfLastBall, elem, false, this.currentColors[i])
            this.tabOfNextBalls.push(ball)
            this.CurrentIdOfLastBall += 1
        }
    }

    addToBoard(): void {
        for (let i: number = 0; i < this.tabOfNextBalls.length; i++) {
            let fieldId = Math.floor(Math.random() * 81)
            if (this.tabOfAllBalls.length != 81) {
                if (this.tabOfFields[fieldId].getFilled() == false) {
                    this.tabOfFields[fieldId].changeFilled()
                    this.tabOfFields[fieldId].cell.appendChild(this.tabOfNextBalls[i].div)
                    let col: number = fieldId % 9
                    let row: number = Math.floor(fieldId / 9)
                    this.tabOfNextBalls[i].changeCol(col)
                    this.tabOfNextBalls[i].changeRow(row)
                    this.tabOfNextBalls[i].changeField(fieldId)
                    this.tabOfAllBalls.push(this.tabOfNextBalls[i])
                }
                else {
                    i -= 1
                }
            }
            else {
                break
            }
        }
        this.clearTableOfNextBalls()
        document.getElementById("tableToShow").innerHTML = ""
    }

    nextMove(): void {
        this.addToBoard()
        this.currentColors = this.add()
        this.lottery()
    }

    //dotad sa losowania i dodawanie kolejnych kulek do planszy


    //metoda szukajaca vertexow do ktorych mozna sie ruszyc z aktualnego vertexa
    findPossibleVertexes(currentVertex: Vertex): Directions {
        let currentVertexId: number = currentVertex.id
        let currentVertexCol: number = currentVertex.col
        let startingDirections: Directions = {
            up: true,
            down: true,
            left: true,
            right: true,
            change: function (direction: string): void {
                for (let property in this) {
                    if (property == direction) {
                        this[property] = !this[property]
                    }
                }
            }
        }
        if (currentVertexId + 9 > 80) {
            startingDirections.change("down")
        }
        if (currentVertexId - 9 < 0) {
            startingDirections.change("up")
        }
        if (currentVertexCol == 0) {
            startingDirections.change("left")
        }
        if (currentVertexCol == 8) {
            startingDirections.change("right")
        }
        return (startingDirections)
    }

    //kolorowanie trasy i przemieszczanie kulki
    createPath(sourceTab: Vertex[], endId: number): void {
        //blokada żeby nie można było kliknąć podczas ruchu 
        this.changeCurrentMovingStatus()
        let lastElemTab: Vertex[] = sourceTab.filter(function (elem) {
            if (elem.id == endId) {
                return (elem)
            }
        })
        this.lastElem = lastElemTab[0]
        if (this.lastElem.from != null) {
            //kolorowanie ostatniego elementu siezki
            this.tabOfFields[this.lastElem.id].changeColor()
            while (this.lastElem.from != null) {
                //cofanie sie po sciezce do poczatku, rownoczesnie kolorujac pola
                let lastElemTab: Vertex[] = sourceTab.filter((elem) => {
                    if (elem.id == this.lastElem.from) {
                        return (elem)
                    }
                })
                this.lastElem = lastElemTab[0]
                this.tabOfFields[this.lastElem.id].changeColor()
            }

            setTimeout(async () => {
                //ruch kulki, usuniecie kolorow i sprawdzenie czy nie trzeba niczego usunac
                if (this.getCurrentClicked() != undefined) {
                    this.getCurrentClicked().changeClicked()
                    this.getCurrentClicked().makeSmallerBall()
                    this.getCurrentClicked().changeField(endId)
                    let col: number = endId % 9
                    let row: number = Math.floor(endId / 9)
                    this.getCurrentClicked().changeCol(col)
                    this.getCurrentClicked().changeRow(row)
                    this.tabOfFields[endId].cell.appendChild(this.getCurrentClicked().getDiv())
                    this.tabOfFields[endId].changeFilled()
                    this.tabOfFields[this.getIdOfPreviousField()].changeFilled()
                    this.resetCurrentClicked()
                    this.changeSthClicked()
                    //dotad ruch kulki
                    console.log(this)
                    this.nextMove() //wylosowanie i dodanei nowych kulek
                    this.resetTabOfCurrentIdsToDel()
                    this.deleting() //szukanie id to usuniecia
                    console.log("id do usuniecia")
                    console.log(this.tabOfCurrentIdsToDel)
                    this.realdeleting() //realne usuwanie
                    document.getElementById("points").innerText = "Punkty: " + this.getScore()
                    console.log("======")
                    console.log(this.tabOfAllBalls.length)
                    console.log("======")
                    //sprawdzanie porazki
                    if (this.tabOfAllBalls.length == 81) {
                        this.lose()
                    }
                    if (this.getLoseStatus() == true) {
                        // window.alert("Twój wynik to:" + this.getScore())
                        document.getElementById("lostInfo").innerText = "Koniec gry, twój wynik to: " + this.getScore()
                    }
                    this.changeCurrentMovingStatus()
                }
                else {
                    this.changeCurrentMovingStatus()
                }
            }, 750)
        }
        else {
            this.changeCurrentMovingStatus()
        }
    }

    //usuwanie z pol o okreslonych id, ktore zostaly ustalone wczesniej
    realdeleting(): void {
        let beforeLength: number = this.tabOfAllBalls.length
        //usuwamy kulki z planszy
        this.tabOfFields = this.tabOfFields.map((elem) => {
            let toDel: boolean = false
            for (let i: number = 0; i < this.tabOfCurrentIdsToDel.length; i++) {
                if (this.tabOfCurrentIdsToDel[i] == elem.getId()) {
                    toDel = true
                }
            }
            if (toDel == false) {
                //jezeli dane pole nie ma id, ktorego szukamy (nie ma tam kulki ktora chcemy usunac) to nic nie robimy
                return (elem)
            }
            else {
                //jezeli ma id, ktorego szukamy to usuwamy kulke
                elem.changeFilled()
                console.log(elem.cell)
                elem.cell.removeChild(elem.cell.children[0])
                return (elem)
            }
        })
        //usuwamy kulki z tablicy z wszystkimi kulkami
        this.tabOfAllBalls = this.tabOfAllBalls.filter((elem) => {
            let toDel: boolean = false
            for (let i: number = 0; i < this.tabOfCurrentIdsToDel.length; i++) {
                if (this.tabOfCurrentIdsToDel[i] == elem.getIdOfField()) {
                    toDel = true
                }
            }
            if (toDel == false) {
                //jezeli ma kulka id pola, ktorego nie szukamy to ja zostawiamy, w innym wypadku nic nie jest returnowane, wiec tak jakby "znika"
                return (elem)
            }
        })
        //aktualizacja wyniku
        let scoreToAdd: number = beforeLength - this.tabOfAllBalls.length
        this.addScore(scoreToAdd)
        console.log(this.tabOfAllBalls, this.tabOfFields)
    }


    //szukanie idpol do usuniecia
    deleting(): void {
        let colors: string[] = ["pink", "red", "blue", "green", "yellow", "orange", "grey"] ///////////////
        for (let i: number = 0; i < colors.length; i++) {
            let nowTab: Ball[] = []
            for (let j: number = 0; j < this.tabOfAllBalls.length; j++) {
                if (this.tabOfAllBalls[j].color == colors[i]) {
                    nowTab.push(this.tabOfAllBalls[j])
                }
            }
            let tabOfBallsInEachRow: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            for (let j: number = 0; j < nowTab.length; j++) {
                tabOfBallsInEachRow[nowTab[j].getRow()] += 1
            }
            for (let j: number = 0; j < tabOfBallsInEachRow.length; j++) {
                if (tabOfBallsInEachRow[j] >= 5) {
                    let tabInThatRow: number[] = []
                    for (let k: number = 0; k < nowTab.length; k++) {
                        if (nowTab[k].getRow() == j) {
                            tabInThatRow.push(nowTab[k].getIdOfField())
                        }
                    }
                    tabInThatRow = tabInThatRow.sort(function (a, b) { return a - b })
                    let prev: number = null
                    let biggestScore: number = 0;
                    let biggestStartingIndex: number;
                    let currentScore: number = 0;
                    let currentStartingIndex: number;
                    for (let k: number = 0; k < tabInThatRow.length; k++) {
                        if (prev == null) {
                            currentScore += 1;
                            currentStartingIndex = k
                        }
                        else if (tabInThatRow[k] == (prev + 1)) {
                            if (currentScore == 1) {
                                currentStartingIndex = (k - 1)
                            }
                            currentScore += 1;
                        }
                        else {
                            if (biggestScore < currentScore) {
                                biggestScore = currentScore
                                biggestStartingIndex = currentStartingIndex;
                            }
                            currentScore = 1;
                            currentStartingIndex = null
                        }
                        prev = tabInThatRow[k]
                    }
                    if (biggestScore < currentScore) {
                        biggestScore = currentScore
                        biggestStartingIndex = currentStartingIndex;
                    }
                    console.log("rzedy")
                    if (biggestScore >= 5) {
                        for (let k: number = biggestStartingIndex; k < (biggestStartingIndex + biggestScore); k++) {
                            // console.log(tabInThatRow[k])
                            this.tabOfCurrentIdsToDel.push(tabInThatRow[k])
                        }
                    }
                }
            }
        }
        for (let i: number = 0; i < colors.length; i++) {
            let nowTab: Ball[] = []
            for (let j: number = 0; j < this.tabOfAllBalls.length; j++) {
                if (this.tabOfAllBalls[j].color == colors[i]) {
                    nowTab.push(this.tabOfAllBalls[j])
                }
            }
            //zbijanie w pionie   
            let tabOfBallsInEachCol: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            for (let j: number = 0; j < nowTab.length; j++) {
                tabOfBallsInEachCol[nowTab[j].getCol()] += 1
            }
            for (let j: number = 0; j < tabOfBallsInEachCol.length; j++) {
                if (tabOfBallsInEachCol[j] >= 5) {
                    let tabInThatCol: number[] = []
                    for (let k: number = 0; k < nowTab.length; k++) {
                        if (nowTab[k].getCol() == j) {
                            tabInThatCol.push(nowTab[k].getIdOfField())
                        }
                    }
                    tabInThatCol = tabInThatCol.sort(function (a, b) { return a - b })
                    let prev: number = null
                    let biggestScore: number = 0;
                    let biggestStartingIndex: number;
                    let currentScore: number = 0;
                    let currentStartingIndex: number;
                    for (let k: number = 0; k < tabInThatCol.length; k++) {
                        if (prev == null) {
                            currentScore += 1;
                            currentStartingIndex = k
                        }
                        else if (tabInThatCol[k] == (prev + 9)) {
                            if (currentScore == 1) {
                                currentStartingIndex = (k - 1)
                            }
                            currentScore += 1;
                        }
                        else {
                            if (biggestScore < currentScore) {
                                biggestScore = currentScore
                                biggestStartingIndex = currentStartingIndex;
                            }
                            currentScore = 1;
                            currentStartingIndex = null
                        }
                        prev = tabInThatCol[k]
                    }
                    if (biggestScore < currentScore) {
                        biggestScore = currentScore
                        biggestStartingIndex = currentStartingIndex;
                    }
                    console.log("kolumny")
                    if (biggestScore >= 5) {
                        for (let k: number = biggestStartingIndex; k < (biggestStartingIndex + biggestScore); k++) {
                            // console.log(tabInThatCol[k])
                            this.tabOfCurrentIdsToDel.push(tabInThatCol[k])
                        }
                    }
                }
            }
        }
        for (let i: number = 0; i < colors.length; i++) {
            let nowTab: Ball[] = []
            for (let j: number = 0; j < this.tabOfAllBalls.length; j++) {
                if (this.tabOfAllBalls[j].color == colors[i]) {
                    nowTab.push(this.tabOfAllBalls[j])
                }
            }
            let allCantBalls = nowTab.map(function (elem) {
                return (elem.getIdOfField())
            })
            this.cant(allCantBalls)
            this.cantLeft(allCantBalls)
        }
    }
    cant(allCantBalls: number[]): void {
        allCantBalls = allCantBalls.sort(function (a, b) { return a - b })
        let prevTab: number[]
        let allPrevTab: number[] = []
        for (let i: number = 0; i < allCantBalls.length; i++) {
            let tabOfPossibleBalls: number[] = allCantBalls.filter(function (elem) { //szukamy ciagow o dziesiec wiekszych
                if (elem % 10 == allCantBalls[i] % 10) {
                    return (elem.toString())
                }
            })
            let prevCheck: boolean = true
            if (tabOfPossibleBalls != undefined && prevTab != undefined) {
                if (allPrevTab.includes(tabOfPossibleBalls[0])) {
                    prevCheck = false
                }
                else {
                    for (let j: number = 0; j < tabOfPossibleBalls.length; j++) {
                        if (tabOfPossibleBalls[j] == prevTab[j]) {
                            prevCheck = false
                        }
                    }
                }
            }
            if (tabOfPossibleBalls.length >= 5 && prevCheck == true) { //sprawdzamy czy ciag ma chociaz 5 elementow
                let isOk: boolean = true
                let tabOfIndexesOfGaps: number[] = []
                for (let j: number = 0; j < tabOfPossibleBalls.length; j++) { //czy ciag ma dziury
                    if (tabOfPossibleBalls[j] != tabOfPossibleBalls[0] + j * 10) {
                        if (tabOfIndexesOfGaps.length == 0) {
                            tabOfIndexesOfGaps.push(j)
                        }
                        else if (tabOfPossibleBalls[j] != tabOfPossibleBalls[j - 1] + 10) {
                            tabOfIndexesOfGaps.push(j)
                        }
                        isOk = false
                    }
                }
                if (isOk == true) { //mamy ciag bez przerw i chcemy sprawdzic czy nie ma przeskoku
                    let startingRow: number
                    let oneRow: boolean = true
                    let gapIndex: number
                    for (let j: number = 0; j < tabOfPossibleBalls.length; j++) { //tu jest zaimplementowane uniwersalne sprawdzenie tego czy kazda kolejna kulka jest w kolejnym rzedzie, dziala dobrze zarowno dla sprawdzenia czy nie "przeskakujemy o 2 przy ruchu w prawo" jak idla sprawdzenie czy nie "zostajemy w tym samym wierszu przy ruchu w lewo"
                        if (j == 0) {
                            startingRow = Math.floor(tabOfPossibleBalls[j] / 9)
                        }
                        let currentRow = Math.floor(tabOfPossibleBalls[j] / 9)
                        if (currentRow != startingRow + j) {
                            oneRow = false
                            if (gapIndex == undefined) {
                                gapIndex = j
                            }
                        }
                    }
                    if (oneRow == true) { // ciag nie ma przeskoku
                        // console.log("DO ZBICIA NA SKOS: ", tabOfPossibleBalls)
                        for (let j: number = 0; j < tabOfPossibleBalls.length; j++) {
                            this.tabOfCurrentIdsToDel.push(tabOfPossibleBalls[j])
                        }
                    }
                    else { //ciag ma przeskok i na podstawie miejsca przeskoku stwierdzimy czy da sie cos zbic
                        if (gapIndex > 4) {
                            let result: number[] = tabOfPossibleBalls.slice(0, gapIndex)
                            // console.log("DO ZBICIA NA SKOS: ", result)
                            for (let j: number = 0; j < result.length; j++) {
                                this.tabOfCurrentIdsToDel.push(result[j])
                            }
                        }
                        else {
                            if (tabOfPossibleBalls.length - gapIndex >= 5) { //jezeli jest tam wystarczajaco kulek
                                let result: number[] = tabOfPossibleBalls.slice(gapIndex)
                                // console.log("DO ZBICIA NA SKOS: ", result)
                                for (let j: number = 0; j < result.length; j++) {
                                    this.tabOfCurrentIdsToDel.push(result[j])
                                }
                            }
                        }
                    }
                }
                else {
                    let prevStart: number = 0
                    for (let j: number = 0; j < tabOfIndexesOfGaps.length; j++) {
                        this.cant(tabOfPossibleBalls.slice(prevStart, tabOfIndexesOfGaps[j]))
                        prevStart = tabOfIndexesOfGaps[j]
                    }
                    this.cant(tabOfPossibleBalls.slice(prevStart))
                }
            }
            prevTab = tabOfPossibleBalls
            for (let j: number = 0; j < tabOfPossibleBalls.length; j++) {
                allPrevTab.push(tabOfPossibleBalls[j])
            }
        }
    }
    ///////////////////////////////////////
    cantLeft(allCantBalls: number[]): void {
        allCantBalls = allCantBalls.sort(function (a, b) { return a - b })
        let prevTab: number[]
        let allPrevTab: number[] = []
        for (let i: number = 0; i < allCantBalls.length; i++) {
            let tabOfPossibleBalls: number[] = allCantBalls.filter(function (elem) { //szukamy ciagow o osiem wiekszych
                if (elem % 8 == allCantBalls[i] % 8) {
                    return (elem.toString())
                }
            })
            let prevCheck: boolean = true
            if (tabOfPossibleBalls != undefined && prevTab != undefined) {
                if (allPrevTab.includes(tabOfPossibleBalls[0])) {
                    prevCheck = false
                }
                else {
                    for (let j: number = 0; j < tabOfPossibleBalls.length; j++) {
                        if (tabOfPossibleBalls[j] == prevTab[j]) {
                            prevCheck = false
                        }
                    }
                }
            }
            if (tabOfPossibleBalls.length >= 5 && prevCheck == true) { //sprawdzamy czy ciag ma chociaz 5 elementow
                let isOk: boolean = true
                let tabOfIndexesOfGaps: number[] = []
                for (let j: number = 0; j < tabOfPossibleBalls.length; j++) { //czy ciag ma dziury
                    if (tabOfPossibleBalls[j] != tabOfPossibleBalls[0] + j * 8) {
                        if (tabOfIndexesOfGaps.length == 0) {
                            tabOfIndexesOfGaps.push(j)
                        }
                        else if (tabOfPossibleBalls[j] != tabOfPossibleBalls[j - 1] + 8) {
                            tabOfIndexesOfGaps.push(j)
                        }
                        isOk = false
                    }
                }
                if (isOk == true) { //mamy ciag bez przerw i chcemy sprawdzic czy nie ma przeskoku
                    let startingRow: number
                    let oneRow: boolean = true
                    let gapIndex: number
                    for (let j: number = 0; j < tabOfPossibleBalls.length; j++) {
                        if (j == 0) {
                            startingRow = Math.floor(tabOfPossibleBalls[j] / 9)
                        }
                        let currentRow = Math.floor(tabOfPossibleBalls[j] / 9)
                        if (currentRow != startingRow + j) { //tu jest zaimplementowane uniwersalne sprawdzenie tego czy kazda kolejna kulka jest w kolejnym rzedzie, dziala dobrze zarowno dla sprawdzenia czy nie "przeskakujemy o 2 przy ruchu w prawo" jak idla sprawdzenie czy nie "zostajemy w tym samym wierszu przy ruchu w lewo"
                            oneRow = false
                            if (gapIndex == undefined) {
                                gapIndex = j
                            }
                        }
                    }
                    if (oneRow == true) { // ciag nie ma przeskoku
                        for (let j: number = 0; j < tabOfPossibleBalls.length; j++) {
                            this.tabOfCurrentIdsToDel.push(tabOfPossibleBalls[j])
                        }
                    }
                    else { //ciag ma przeskok i na podstawie miejsca przeskoku stwierdzimy czy da sie cos zbic
                        if (gapIndex > 4) {
                            let result: number[] = tabOfPossibleBalls.slice(0, gapIndex)
                            for (let j: number = 0; j < result.length; j++) {
                                this.tabOfCurrentIdsToDel.push(result[j])
                            }
                            if (tabOfPossibleBalls.length - gapIndex >= 5) {
                                result = tabOfPossibleBalls.slice(gapIndex)
                                for (let j: number = 0; j < result.length; j++) {
                                    this.tabOfCurrentIdsToDel.push(result[j])
                                }
                            }
                        }
                        else {
                            if (tabOfPossibleBalls.length - gapIndex >= 5) { //jezeli jest tam wystarczajaco kulek
                                let result: number[] = tabOfPossibleBalls.slice(gapIndex)
                                for (let j: number = 0; j < result.length; j++) {
                                    this.tabOfCurrentIdsToDel.push(result[j])
                                }
                            }
                        }
                    }
                }
                else {
                    let prevStart: number = 0
                    for (let j: number = 0; j < tabOfIndexesOfGaps.length; j++) {
                        this.cantLeft(tabOfPossibleBalls.slice(prevStart, tabOfIndexesOfGaps[j]))
                        prevStart = tabOfIndexesOfGaps[j]
                    }
                    this.cantLeft(tabOfPossibleBalls.slice(prevStart))
                }
            }
            prevTab = tabOfPossibleBalls
            for (let j: number = 0; j < tabOfPossibleBalls.length; j++) {
                allPrevTab.push(tabOfPossibleBalls[j])
            }
        }
    }
}
export { Main, Directions }