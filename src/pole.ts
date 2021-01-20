class Field {
    private readonly col: number; private readonly row: number; private readonly id: number; private filled: boolean; cell: HTMLElement
    constructor(col: number, row: number, id: number, filled: boolean, cell: HTMLElement) {
        this.row = row
        this.col = col
        this.id = id
        this.filled = filled
        this.cell = cell
    }

    changeColor(): void {
        this.cell.style.backgroundColor = "#de10da"
        setTimeout(() => {
            this.cell.style.backgroundColor = "white"
        }, 750)
    }

    getId(): number {
        return (this.id)
    }

    getCol(): number {
        return (this.col)
    }

    getRow(): number {
        return (this.row)
    }

    getFilled(): boolean {
        return (this.filled)
    }

    changeFilled(): void {
        this.filled = !this.filled
    }


}
export { Field }
