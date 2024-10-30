import './Loader.css'
import { miyagi } from 'ldrs'

miyagi.register()

const Loader = () => {
    return (
        <div className='Loader'>
            <div>
                <l-miyagi
                    size="40"
                    speed="0.9"
                    color="#67389B"
                ></l-miyagi>
                <h3>  Fetching Url data...</h3>
            </div>
        </div>
    )
}

export default Loader