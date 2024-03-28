import { BrowserRouter, Route, Switch } from "react-router-dom";

import CreateRoom from "./components/CreateRoom";
import Room from "./components/Room";

function App() {
        return (
                <div className="App">
                        <BrowserRouter>
                                <Switch>
                                        <Route
                                                path="/"
                                                Component={CreateRoom}
                                        ></Route>
                                        <Route
                                                path="/room/:roomID"
                                                Component={Room}
                                        ></Route>
                                </Switch>
                        </BrowserRouter>
                </div>
        );
}

export default App;
