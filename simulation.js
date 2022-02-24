class Simulation {
    constructor (ctx, options) {
        if (!options) options = {}
        if (ctx.constructor.name == "HTMLCanvasElement") ctx = canvas.getContext('2d')
        if (ctx == null) throw new Error("Could not create 2D rendering context with the provided canvas.")
        if (ctx.constructor.name != "CanvasRenderingContext2D") throw new Error('Game must be constructed with a CanvasRenderingContext2D or HTMLCanvasElement.')
        this.ctx = ctx
        this.planets = []
        this.max = [this.ctx.canvas.width, this.ctx.canvas.height]
        this.min = [0, 0]
        this.distance = options.distance ?? this.constructor.euclidean
    }
    static euclidean (...args) {
        let fast;
        if (typeof args[args.length-1] == 'boolean') fast = args.shift()
        if (fast) return Math.sqrt((args[0][0]-args[1][0])**2 + (args[0][1]-args[1][1])**2)
        let points = []
        let p1, p2;
        if (args.length == 4) p1 = [args[0], args[1]], p2 = [args[2], args[3]]
        else if (args.length == 2) p1 = args[0], p2 = args[1]
        else throw new Error('This function requires either 2 vectors of coordinates or 4 coordinate scalars as arguments.')
        return Math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)
    }
    addPlanet (options) {
        if (!options) return this.planets.push({radius: 10, color: 'lime', vx: 0, vy: 0, x: 0, y: 0, gravity: 1})
        options.coords = options.coords ?? [options.x ?? 0, options.y ?? 0]
        delete options.x
        delete options.y
        options.color = options.color ?? 'white'
        //options.velocity = options.velocity ?? [Math.random() * 10 - 5, Math.random() * 10 - 5]
        options.velocity = options.velocity ?? [0, 0]
        options.radius = options.radius ?? 3
        options.stable = options.stable ?? false
        options.gravity = ( options.gravity ?? options.radius/24 )
        options.gravity += options.stable ? 0 : (Math.random() * options.gravity) - (options.gravity/2)
        this.planets.push(options)
    }
    removePlanet (index) {
        if (typeof index == undefined) index = this.planets.length - 1
        if (!(index in this.planets)) return false;
        return this.planets.splice(index, 1)
    }
    calculate () {
        //Calculate how to change the planets' velocity using distances from other planets
        let planets = this.planets.map((planet, i) => {
            this.planets.forEach((otherPlanet, ind) => {
                let distance = ind != i ? this.distance(planet.coords, otherPlanet.coords) : null
                if (!distance) return;
                let position = planet.coords.map((coord, i) => coord - otherPlanet.coords[i])              
                let acceleration = position.map((pos) => pos / distance)
                planet.velocity =  planet.velocity.map((velocity, i) => velocity - acceleration[i])
            })
            return planet;
        })
        this.planets = planets
        //Adjust planets to move
        this.planets = this.planets.map(planet => {
            planet.coords = planet.coords.map((coord, i) => {
                coord += planet.velocity[i]
                if (coord > this.max[i]) coord = this.min[i]
                if (coord < this.min[i]) coord = this.max[i]
                return coord;
            })
            return planet
        })
    }
    render () {
        let oldStyle = this.ctx.fillStyle
        for (let planet of this.planets) {
            this.ctx.beginPath();
            this.ctx.fillStyle = planet.color
            this.ctx.arc(...planet.coords, planet.radius, 0, 2 * Math.PI);
            this.ctx.fill()

            /*
            this.ctx.beginPath();
            this.ctx.strokeStyle = planet.color
            this.ctx.arc(...planet.coords, 100, 0, 2 * Math.PI);
            this.ctx.stroke()
            */

        }
        this.ctx.fillStyle = oldStyle
    }
}