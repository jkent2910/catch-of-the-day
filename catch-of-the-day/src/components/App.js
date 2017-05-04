import React  from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base.js';

class App extends React.Component {
    constructor() {
        super();
        this.addFish = this.addFish.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.removeFish = this.removeFish.bind(this);
        this.removeFromOrder = this.removeFromOrder.bind(this);
        this.state = {
            fishes: {},
            order: {}
        };
    }

    componentWillMount() {
        //this runs right before the app is rendered
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`,
            {
                context: this,
                state: 'fishes'
            });

        // check if there is any order in local storage
        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

        if (localStorageRef) {
            // update app components order state
            this.setState({
                order: JSON.parse(localStorageRef)
            });
        }
    }

    componentWillUnMount() {
        base.removeBinding(this.ref);
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem(`order-${this.props.params.storeId}`,
        JSON.stringify(nextState.order))
    }

    addFish(fish) {
        // update our state
        const fishes = {...this.state.fishes};
        // add in our new fish
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        // set state
        this.setState({fishes: fishes})
    }

    updateFish(key, updatedFish) {
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({fishes});
    }

    removeFish(key) {
        const fishes = {...this.state.fishes};
        fishes[key] = null;
        this.setState({fishes});
    }

    loadSamples() {
        this.setState({fishes: sampleFishes })
    }

    addToOrder(key) {
        const order = {...this.state.order};
        order[key] = order[key] + 1 || 1;
        this.setState({order: order})
    }

    removeFromOrder(key) {
        const order = {...this.state.order};
        delete order[key];
        this.setState({order})
    }
    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        {Object.keys(this.state.fishes)
                            .map(key => <Fish key={key} index={key} addToOrder={this.addToOrder} details={this.state.fishes[key]}/>)}
                    </ul>
                </div>
                <Order removeFromOrder={this.removeFromOrder} params={this.props.params} fishes={this.state.fishes} order={this.state.order} />
                <Inventory removeFish={this.removeFish} updateFish={this.updateFish} fishes={this.state.fishes} loadSamples={this.loadSamples} addFish={this.addFish} storeId={this.props.params.storeId} />
            </div>
        )
    }
}

App.propTypes = {
    params: React.PropTypes.object.isRequired
}

export default App;