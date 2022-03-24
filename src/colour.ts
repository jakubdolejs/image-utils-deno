export class Colour {
    red: number
    green: number
    blue: number
    alpha: number

    static readonly RED: Colour = new Colour(0xFF, 0, 0)
    static readonly GREEN: Colour = new Colour(0, 0xFF, 0)
    static readonly BLUE: Colour = new Colour(0, 0, 0xFF)
    static readonly TRANSPARENT: Colour = new Colour(0, 0, 0, 0)

    constructor(red: number, green: number, blue: number, alpha: number=1) {
        this.red = red
        this.blue = blue
        this.green = green
        this.alpha = alpha
    }

    toString(): string {
        return `rgba(${Math.max(Math.min(this.red, 255), 0)},${Math.max(Math.min(this.green, 255), 0)},${Math.max(Math.min(this.blue, 255), 0)},${Math.max(Math.min(this.alpha, 1), 0)})`
    }
}