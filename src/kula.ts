class Ball {
    private col: number; private row: number; private id: number; private readonly ID: number; div: HTMLDivElement; private clicked: boolean; color: string
    constructor(col: number, row: number, id: number, ID: number, div: HTMLDivElement, clicked: boolean, color: string) {
        this.row = row
        this.col = col
        this.id = id //id pola w ktorym sie znajduje
        this.ID = ID //id kulki
        this.div = div
        this.clicked = clicked
        this.color = color
    }

    getCol():number{
        return(this.col)
    }

    getRow(): number{
        return(this.row)
    }

    getDiv(): HTMLDivElement {
        return (this.div)
    }

    changeCol(col: number): void {
        this.col = col
    }

    changeRow(row: number): void {
        this.row = row
    }

    changeField(newId: number): void {
        this.id = newId
    }

    getIdOfField(): number {
        return (this.id)
    }

    makeBiggerBall(): void {
        this.div.style.width = "70px"
        this.div.style.height = "70px"
    }

    makeSmallerBall(): void {
        this.div.style.width = "50px"
        this.div.style.height = "50px"
    }

    getClickedInfo(): boolean {
        return (this.clicked)
    }

    changeClicked(): void {
        this.clicked = !this.clicked
    }
}
export { Ball } 
