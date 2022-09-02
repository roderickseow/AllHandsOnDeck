const screenSpace = new planck.Vec2(25, 25)

class GameObject {
	x = 0
	y = 0
	components = []

	constructor(initX, initY) {
		this.x = initX
		this.y = initY
	}

	register(component) {
		this.components.push(component);
		component.gameObject = this;
	}

	update(p, dt) {
		for(var i = 0; i < this.components.length; i++) {
			this.components.update(dt)
		}
	}
}

class FloorController extends GameObject {
	points = []
	bodies = []
	height = 1
	width
	numOfFingers = 10

	constructor(initX, initY, world) {
		var pl = planck, Vec2 = pl.Vec2;
		super(initX, initY)
		this.width = screenSpace.x / this.numOfFingers 

		for (var i = 0; i < this.numOfFingers; ++i) {
			var point = Vec2(initX + i * screenSpace.x / this.numOfFingers, initY - 5 * Math.random());
			this.points.push(point)
			var body = world.createBody();
			this.bodies.push(body)
			body.createFixture(planck.Box(this.width * 0.5, this.height * 0.5));
			body.setPosition(Vec2(point.x + this.width * 0.5, point.y + this.height * 0.5))
		}
	}

	draw(p) {
		var dx = p.width / screenSpace.x 
		var dy = p.height / screenSpace.y
		p.stroke(200);
		for(var i = 0; i < this.points.length-1; i++)
			p.rect(this.points[i].x * dx, this.points[i].y * dy, screenSpace.x / this.numOfFingers * dx, this.height * dy)
	}

	update(p, dt) {
		var pl = planck, Vec2 = pl.Vec2;
		for(var i = 0; i < this.bodies.length; i++){
			this.bodies[i].setPosition(Vec2(this.points[i].x + this.width * 0.5, this.points[i].y + this.height * 0.5))
		}
		/*
		for(var i = 0; i < this.points.length; i++)
			this.points[i].y -= 2 * dt		
		*/
	}
}

class PlayerController extends GameObject {	
	box
	size = 1
	speed = 10

	constructor(initX, initY, world) {
		var pl = planck, Vec2 = pl.Vec2;
		super(initX, initY)
		this.box = world.createBody().setDynamic()
		this.box.createFixture(pl.Circle(this.size, Vec2(this.x, this.y)));
		this.box.setPosition(Vec2(this.x, this.y));
		this.box.setMassData({ mass : 1, center : Vec2(), I : 1})
	}

	update(p, dt) {
		var pl = planck, Vec2 = pl.Vec2;
		var pos = this.box.getPosition()
		this.x = pos.x
		this.y = pos.y

		if (p.keyIsDown(p.LEFT_ARROW)) {
			this.box.setAwake(true)
			this.box.applyLinearImpulse(Vec2(-this.speed * dt, 0), pos)
			//this.box.applyAngularImpulse(-this.speed * dt)
		}
		if (p.keyIsDown(p.RIGHT_ARROW)) {
			this.box.setAwake(true)
			//this.box.applyAngularImpulse(this.speed * dt)
			this.box.applyLinearImpulse(Vec2(this.speed * dt, 0), pos)
		}
	}

	draw(p) {
		var dx = p.width / screenSpace.x 
		var dy = p.height / screenSpace.y
		p.fill(100)
		p.circle(this.x * dx, this.y * dy, this.size * dx)
	}
}

class Platform extends GameObject {
	body
	width
	height

	constructor(initX, initY, width, height, world) {
		var pl = planck, Vec2 = pl.Vec2;
		super(initX, initY)
		this.width = width
		this.height = height
		this.body = world.createBody()
		this.body.createFixture(pl.Box(width*0.5, height*0.5))
		this.body.setPosition(Vec2(this.x + (width*0.5), this.y + (height*0.5)))
	}

	draw(p) {
		var dx = p.width / screenSpace.x
		var dy = p.height / screenSpace.y 
		p.fill(30)
		p.rect(this.x * dx, this.y * dy, this.width * dx, this.height * dy)
	}
}
