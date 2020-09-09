import { _decorator, Component, Node, tween, Vec3, Collider2D, Contact2DType, Label } from 'cc';
const { ccclass, property, type } = _decorator;

@ccclass('Tag')
export class Tag extends Component {
    @type(Collider2D)
    otherCollider: Collider2D = null;

    @type(Label)
    tagLabel: Label = null;

    start () {
        // Your initialization goes here.

        tween(this.node)
            .by(3, { eulerAngles: new Vec3(0, 0, -360) })
            .repeatForever()
            .start()

        if (this.otherCollider) {
            this.otherCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact (self: Collider2D, other: Collider2D) {
        if (this.tagLabel) {
            this.tagLabel.string = other.tag.toString();
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
