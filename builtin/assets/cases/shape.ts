import { _decorator, Component, Node, find, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Shape')
export class Shape extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.
    }

    onClick (event) {
        let target = event.target;
        let shapeClassName = `cc.${target.name}Collider2D`;
        let nodePath = 'Canvas/root/' + target.parent.name;
        let collider = find(nodePath).getComponent(shapeClassName);
        collider.enabled = !collider.enabled;
        
        // let label = target.getChildByName('Label').getComponent(Label);
        // if (collider.enabled) {
        //     label.string = label.string.replace('Show', 'Hide');
        // }
        // else {
        //     label.string = label.string.replace('Hide', 'Show');   
        // }
    }
}
