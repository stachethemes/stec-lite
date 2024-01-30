import {
    useCalendarMoment,
    useCurrentLayout,
    useSettingsAtts
} from '@Stec/JS/calendar/hooks';


import { useEffect, useState } from 'react';

const AttsReady = ({ settingsAtts, children }) => {

    const [ready, setReady] = useState(false);

    const { setValue: setAtts } = useSettingsAtts();
    const { setValue: setActiveLayout } = useCurrentLayout();
    const { setValue: setCalendarMoment } = useCalendarMoment();

    useEffect(() => {

        if (false === ready) {

            const filterAtts = {};

            for (let attKey in settingsAtts) {

                const value = settingsAtts[attKey];

                // atom_default is the default value set in the atom file
                if ('atom_default' !== value) {
                    filterAtts[attKey] = value;
                }

            }

            setAtts(filterAtts);

            if (filterAtts.calendar__layout) {

                setActiveLayout(filterAtts.calendar__layout);
            }

            if (filterAtts.filter__start_date) {

                const startDate = moment(filterAtts.filter__start_date, 'YYYY-MM-DD', true);

                if (startDate.isValid()) {
                    setCalendarMoment(startDate);
                }
            }

            setReady(true);
        }

    }, [ready, setActiveLayout, setCalendarMoment, setAtts, settingsAtts]);

    if (false === ready) {
        return null;
    }

    return (
        children
    )

}

export default AttsReady;