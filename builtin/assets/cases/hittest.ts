import { _decorator, Component, Node, PhysicsSystem2D, Touch, Collider2D, SpriteComponent, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Hittst')
export class Hittst extends Component {
    lastResults: Collider2D[] = [];
    start () {
        // Your initialization goes here.
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart (event: Touch) {
        let res = PhysicsSystem2D.instance.testPoint(event.getLocation());
        this.lastResults = res.concat([]);
        res.forEach(c => {
            let s = c.getComponent(SpriteComponent);
            if (s) {
                s.color = Color.RED;
            }
        })
    }

    onTouchEnd (event: Touch) {
        this.lastResults.forEach(c => {
            let s = c.getComponent(SpriteComponent);
            if (s) {
                s.color = Color.WHITE;
            }
        })
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
