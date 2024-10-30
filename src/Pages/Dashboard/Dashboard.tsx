import React, { useState, useEffect } from 'react';
import { Splitter } from 'antd';
import './Dashboard.css';
import { IDataSource } from './Dashboard.interface';
import PropertiesTab from '../../Components/PropertiesTab/PropertiesTab';
import WebViewTab from '../../Components/WebViewTab/WebViewTab';


const Dashboard: React.FC = () => {
    const [isVertical, setIsVertical] = useState<Boolean>(false);
    const [elementDetails, setElementDetails] = useState<IDataSource[]>();

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handleScreenChange = (e: MediaQueryListEvent) => setIsVertical(e.matches);
        setIsVertical(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleScreenChange);
        return () => mediaQuery.removeEventListener('change', handleScreenChange);
    }, []);

    return (
        <>
            <Splitter
                className='Splitter'
                layout={isVertical ? 'vertical' : 'horizontal'}
            >
                <Splitter.Panel defaultSize="30%" min="20%" max="70%">
                    <PropertiesTab elementDetails={elementDetails} />
                </Splitter.Panel>
                <Splitter.Panel style={{ position: 'relative', overflow: 'hidden' }}>
                    <WebViewTab setElementDetails={setElementDetails} />
                </Splitter.Panel>
            </Splitter>
        </>
    );
};

export default Dashboard;
