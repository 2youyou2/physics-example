import { _decorator, Component, Node, BoxCollider2D, Contact2DType, Sprite, Color, tween, Vec3, Collider2D, PhysicsSystem2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ContactResults')
export class ContactResults extends Component {
    touchingCountMap: Map<Node, number> = new Map;

    start () {
        // Your initialization goes here.
        PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeinContact, this);
        PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    addContact (c: Collider2D) {
        let count = this.touchingCountMap.get(c.node) || 0;
        this.touchingCountMap.set(c.node, ++count);

        let sprite = c.getComponent(Sprite);
        if (sprite) {
            sprite.color = Color.RED;
        }
    }

    removeContact (c: Collider2D) {
        let count = this.touchingCountMap.get(c.node) || 0;
        --count;
        if (count <= 0) {
            this.touchingCountMap.delete(c.node);

            let sprite = c.getComponent(Sprite);
            if (sprite) {
                sprite.color = Color.WHITE;
            }
        }
        else {
            this.touchingCountMap.set(c.node, count);
        }
    }

    onBeinContact (a: Collider2D, b: Collider2D) {
        this.addContact(a);
        this.addContact(b);
    }

    onEndContact (a: Collider2D, b: Collider2D) {
        this.removeContact(a);
        this.removeContact(b);
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
