import { _decorator, Component, Node, BoxCollider2D, Contact2DType, Sprite, Color, tween, Vec3, Collider2D, PhysicsSystem2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Rotate')
export class Rotate extends Component {
    @property
    time = 6;

    @property
    angle = 360;

    start () {
        tween(this.node)
            .by(this.time, { eulerAngles: new Vec3(0, 0, this.angle) })
            .repeatForever()
            .start()
    }
}
