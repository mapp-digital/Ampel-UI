import * as React from 'react';

const Spinner: React.FunctionComponent<{}> = () => {
    return (
        <div className="spinner">
            <div className="spinner-element">
                <div className="spinner-container">
                    <ul className="spinner-circles" data-qa="spinner">
                        <li className="spinner-circle spinner-circle-1" />
                        <li className="spinner-circle spinner-circle-2" />
                        <li className="spinner-circle spinner-circle-3" />
                    </ul>
                </div>
            </div>
        </div>
    );
};

export { Spinner };
