import Button from '@Stec/CommonComponents/Button';
import { useDashboardCounters, useDashboardMenu } from '@Stec/JS/dashboard/hooks.js';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { isNumber } from 'lodash';
import CountUp from 'react-countup';
import items from './items';
import CompareButton from './Comparison';

const MenuItem = ({ item, itemsCount = false }) => {

    const { setActiveMenu } = useDashboardMenu();
    const hasCounter = itemsCount !== false;

    return (
        <StecDiv className='stec-dashboard-home-item'>

            <StecSpan className='stec-dashboard-home-item-icon'>
                <i className={item.icon} style={{ color: item.color }} />
            </StecSpan>

            <StecSpan className='stec-dashboard-home-item-title'>{item.label}</StecSpan>

            {hasCounter && <StecSpan className='stec-dashboard-home-item-count'>{<CountUp end={itemsCount} duration={0.2} />}</StecSpan>}

            <StecDiv className='stec-dashboard-home-item-buttons'>

                {
                    item.buttons.map((button, i) => {

                        if (button.id === 'upgrade-compare') {
                            return <CompareButton
                                key={button.id}
                                label={[<i key='icon' className={button.icon} />, button.label]}
                                className={button.className}
                                style={i > 0 ? { marginLeft: 6 } : {}}
                                target={'_blank'}
                                href={button.href}
                            />
                        }

                        if (button.href) {

                            return <Button
                                key={button.id}
                                label={[<i key='icon' className={button.icon} />, button.label]}
                                className={button.className}
                                style={i > 0 ? { marginLeft: 6 } : {}}
                                target={'_blank'}
                                href={button.href}
                            />

                        }

                        return <Button
                            key={button.id}
                            label={[<i key='icon' className={button.icon} />, button.label]}
                            className={button.className}
                            style={i > 0 ? { marginLeft: 6 } : {}}
                            onClick={() => {
                                setActiveMenu({
                                    page: button.id,
                                    params: {}
                                });
                            }}
                        />

                    })
                }

            </StecDiv>
        </StecDiv>
    )
}

const HomeItems = ({ countersDataReady, countersData }) => {

    return (
        <>
            {
                items.map((item) => {

                    let count = false;

                    if (
                        countersDataReady
                        && isNumber(countersData[item.id])
                    ) {
                        count = parseInt(countersData[item.id], 10);
                    }

                    return (<MenuItem key={item.id} item={item} itemsCount={count} />)

                })
            }
        </>
    )

}

const WithCountersHomeItems = () => {

    const { ready: countersDataReady, data: countersData } = useDashboardCounters();

    return (
        <HomeItems countersDataReady={countersDataReady} countersData={countersData} />
    )

}

function Home() {

    /**
     * Filter for disabling dashboard counters
     */
    const counterDisabled = window.STEC_DISABLE_DASHBOARD_COUNTERS === false;

    return (

        <StecDiv className='stec-dashboard-home'>

            {counterDisabled && <HomeItems countersDataReady={true} countersData={{}} />}

            {!counterDisabled && <WithCountersHomeItems />}

        </StecDiv>
    )
}

export default Home