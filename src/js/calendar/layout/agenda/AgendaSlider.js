import { useMinMaxCalendarMoments, useCalendarMoment, useIsDragging, useSettingsAtt } from '@Stec/JS/calendar/hooks';
import { isMobile } from '@Stec/JS/helpers';
import { StecDiv } from '@Stec/WebComponents';
import { useEffect, useReducer, useRef, useState } from 'react';
import AgendaSliderContent from './AgendaSliderContent';
import AgendaSliderEventsHolder from './AgendaSliderEventsHolder';

const AgendaSlider = () => {

    const instanceId = useSettingsAtt('id');
    const { safeValue: calendarMoment, setValue: setCalendarMoment } = useCalendarMoment();

    const { minAllowedMoment, maxAllowedMoment } = useMinMaxCalendarMoments();

    const [agendaSettings, setAgendaSettings] = useReducer((state, action) => {

        switch (action.type) {

            case 'setMomentA': {

                let momentA = action.value;

                return { ...state, momentA: momentA }
            }

            case 'setMomentB': {

                let momentB = action.value;

                return { ...state, momentB: momentB }
            }

            case 'setActiveCell': {

                return { ...state, activeCell: action.value }
            }

            default:

                return state;
        }

    }, {
        momentA: false,
        momentB: false,
        activeCell: false
    });

    const [eventsA, setEventsA] = useState([]);
    const [eventsB, setEventsB] = useState([]);
    const containerRef = useRef(false);
    const draggableRefA = useRef(false);
    const draggableRefB = useRef(false);
    const isDragging = useIsDragging();

    const toggleCellEventsHolder = (cellMoment) => {

        if (agendaSettings.activeCell && agendaSettings.activeCell.moment.isSame(cellMoment, 'day')) {
            setAgendaSettings({
                type: 'setActiveCell',
                value: false
            });
        } else {
            setAgendaSettings({
                type: 'setActiveCell',
                value: {
                    moment: cellMoment
                }
            });
        }
    }

    useEffect(() => {

        /**
         * REACT 17
         * https://reactjs.org/blog/2020/08/10/react-v17-rc.html#effect-cleanup-timing
         * 
         * The problem is that someRef.current is mutable, 
         * so by the time the cleanup function runs, it may have been set to null. 
         * The solution is to capture any mutable values inside the effect:
         */
        const draggableRefAinstance = draggableRefA.current;
        const draggableRefBinstance = draggableRefB.current;

        const draggableArray = [draggableRefAinstance, draggableRefBinstance];

        let aMomentDate = moment.utc(calendarMoment).startOf('month');
        let bMomentDate = moment.utc(aMomentDate).add(1, 'month');

        // @test
        if (bMomentDate.isAfter(maxAllowedMoment, 'month')) {
            bMomentDate = moment.utc(minAllowedMoment);
        }


        let inertiaTimeout;
        let animationFrame;
        let isDraggable = false;
        let startX = 0, endX = 0;
        let x1 = 0, x2 = 0;
        let startTime = false;
        let endTime = false;

        const addInertia = () => {
            const direction = startX > endX ? -1 : 1;
            const t = endTime - startTime;
            const v = Math.abs(startX - endX) / t;
            const f = (v / t) * 10000;
            const translateMax = 500;
            const forceToPx = direction * Math.min(f, translateMax);
            const duration = 700;

            // Apply CSS transition to all draggable elements
            draggableArray.forEach(element => {
                element.style.transform = `translateX(${forceToPx}px)`;
                element.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
            });

            // Set a timeout to reset styles and clear inertiaTimeout
            inertiaTimeout = setTimeout(() => {
                draggableArray.forEach(element => {
                    element.style.transform = '';
                    element.style.transition = '';
                    element.style.left = `${element.offsetLeft + forceToPx}px`;
                });

                inertiaTimeout = null;
            }, duration);
        };

        function onSliderMouseDown() {
            isDraggable = true;
        }

        function onDragStart(e) {
            if (isDraggable) {

                if (!isMobile()) {
                    e.preventDefault();
                }

                if (inertiaTimeout) {

                    clearTimeout(inertiaTimeout);
                    inertiaTimeout = null;

                    draggableArray.forEach((element) => {
                        const xOffset = getRealOffsetX(element);
                        element.style.transform = '';
                        element.style.transition = '';
                        element.style.left = xOffset + 'px';
                    });
                }

                x1 = typeof e.clientX === 'number' ? e.clientX : e.touches[0].clientX;
                startX = x1;
                endX = startX;
                startTime = new Date().getTime();

                if (animationFrame) {
                    window.cancelAnimationFrame(animationFrame);
                    animationFrame = null;
                }

                animationFrame = window.requestAnimationFrame(shouldSwapPlaces);
            }
        }

        function onDragEnd(e) {

            if (isDraggable) {

                if (!isMobile()) {
                    e.preventDefault();
                }

                isDraggable = false;
                endTime = new Date().getTime();
                endX = e.clientX || endX;
                addInertia();
            }
        }

        function onDrag(e) {

            if (true === isDraggable) {

                x2 = x1 - (typeof e.clientX === 'number' ? e.clientX : e.touches[0].clientX);
                x1 = typeof e.clientX === 'number' ? e.clientX : e.touches[0].clientX;

                let moveA = draggableRefAinstance.offsetLeft - x2;
                let moveB = draggableRefBinstance.offsetLeft - x2;

                draggableRefAinstance.style.left = moveA + "px";
                draggableRefBinstance.style.left = moveB + "px";
                endX = typeof e.clientX === 'number' ? e.clientX : e.touches[0].clientX;
            }
        }

        const getRealOffsetX = (element) => {
            const containerRect = containerRef.current.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            return elementRect.x - containerRect.x;
        }

        const shouldSwapPlaces = () => {

            if (!containerRef.current || !draggableRefAinstance || !draggableRefBinstance) {
                return;
            }

            const cW = containerRef.current.offsetWidth;
            const aW = draggableRefAinstance.offsetWidth;
            const bW = draggableRefBinstance.offsetWidth;
            const aX = draggableRefAinstance.offsetLeft;
            const bX = draggableRefBinstance.offsetLeft;

            const aRealX = getRealOffsetX(draggableRefAinstance);
            const bRealX = getRealOffsetX(draggableRefBinstance);

            if (aRealX > 0 && bRealX > 0 && bRealX > cW) {

                bMomentDate = moment.utc(aMomentDate).subtract(1, 'month');

                // @test
                if (bMomentDate.isBefore(minAllowedMoment, 'year')) {
                    bMomentDate = moment.utc(maxAllowedMoment).startOf('month');
                }

                setRefElementWidth(draggableRefB, bMomentDate);

                setAgendaSettings({
                    type: 'setMomentB',
                    value: bMomentDate
                });

                draggableRefBinstance.style.left = (aX - draggableRefBinstance.offsetWidth) + 'px';
                // prev blue back
            }
            else if (bRealX > 0 && aRealX > 0 && aRealX > cW) {

                aMomentDate = moment.utc(bMomentDate).subtract(1, 'month');

                // @test
                if (aMomentDate.isBefore(minAllowedMoment, 'year')) {
                    aMomentDate = moment.utc(maxAllowedMoment).startOf('month');
                }

                setRefElementWidth(draggableRefA, aMomentDate);
                setAgendaSettings({
                    type: 'setMomentA',
                    value: aMomentDate
                });

                draggableRefAinstance.style.left = (bX - draggableRefAinstance.offsetWidth) + 'px';
                // prev red back
            }
            else if (aRealX < 0 && bRealX < 0 && aRealX + aW < cW) {

                aMomentDate = moment.utc(bMomentDate).add(1, 'month');

                // @test
                if (aMomentDate.isAfter(maxAllowedMoment, 'year')) {
                    aMomentDate = moment.utc(minAllowedMoment).startOf('month');
                }

                setRefElementWidth(draggableRefA, aMomentDate);
                setAgendaSettings({
                    type: 'setMomentA',
                    value: aMomentDate
                });

                draggableRefAinstance.style.left = (bX + draggableRefBinstance.offsetWidth) + 'px';
                // next red front
            }
            else if (aRealX < 0 && bRealX < 0 && bRealX + bW < cW) {
                bMomentDate = moment.utc(aMomentDate).add(1, 'month');

                // @test
                if (bMomentDate.isAfter(maxAllowedMoment, 'year')) {
                    bMomentDate = moment.utc(minAllowedMoment).startOf('month');
                }

                setRefElementWidth(draggableRefB, bMomentDate);
                setAgendaSettings({
                    type: 'setMomentB',
                    value: bMomentDate
                });

                draggableRefBinstance.style.left = (aX + draggableRefAinstance.offsetWidth) + 'px';
                // next blue front
            }

            if (inertiaTimeout || isDraggable) {
                animationFrame = window.requestAnimationFrame(shouldSwapPlaces);
            }

        }

        const setRefElementWidth = (ref, moment) => {
            const cellsWidth = 90;
            ref.current.style.width = (moment.daysInMonth() + 1) * cellsWidth + 'px';
        }

        const bindControls = () => {

            if (isMobile()) {

                const options = {
                    passive: true
                };

                draggableRefAinstance.addEventListener('touchstart', onSliderMouseDown, options);
                draggableRefBinstance.addEventListener('touchstart', onSliderMouseDown, options);
                document.addEventListener('touchstart', onDragStart, options);
                document.addEventListener('touchend', onDragEnd, options);
                document.addEventListener('touchmove', onDrag, options);
            } else {
                draggableRefAinstance.addEventListener('mousedown', onSliderMouseDown);
                draggableRefBinstance.addEventListener('mousedown', onSliderMouseDown);
                document.addEventListener('mousedown', onDragStart);
                document.addEventListener('mouseup', onDragEnd);
                document.addEventListener('mousemove', onDrag);
            }

        }

        const cleanUp = () => {

            if (isMobile()) {

                const options = {
                    passive: true
                };

                draggableRefAinstance.removeEventListener('touchstart', onSliderMouseDown, options);
                draggableRefBinstance.removeEventListener('touchstart', onSliderMouseDown, options);
                document.removeEventListener('touchstart', onDragStart, options);
                document.removeEventListener('touchend', onDragEnd, options);
                document.removeEventListener('touchmove', onDrag, options);
            } else {
                draggableRefAinstance.removeEventListener('mousedown', onSliderMouseDown);
                draggableRefBinstance.removeEventListener('mousedown', onSliderMouseDown);
                document.removeEventListener('mousedown', onDragStart);
                document.removeEventListener('mouseup', onDragEnd);
                document.removeEventListener('mousemove', onDrag);
            }

            if (inertiaTimeout) {
                clearTimeout(inertiaTimeout);
                inertiaTimeout = null;
            }

            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        }

        const init = () => {

            bindControls();

            setRefElementWidth(draggableRefA, aMomentDate);
            setRefElementWidth(draggableRefB, bMomentDate);

            setAgendaSettings({
                type: 'setMomentA',
                value: aMomentDate
            });

            setAgendaSettings({
                type: 'setMomentB',
                value: bMomentDate
            });

            draggableRefBinstance.style.left = draggableRefAinstance.offsetWidth + 'px';

        }

        init();

        return () => {
            cleanUp();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Center on the active day
    useEffect(() => {
        // Calculate the current active day's position
        const currentDate = moment(calendarMoment);

        // if the date is 1st or 2nd or 3rd of the month, then no need to center
        if (currentDate.date() <= 3) {
            return;
        }

        const containerWidth = containerRef.current.offsetWidth;
        const cellWidth = 90; // Assuming each day's width is 90px

        const currentDay = currentDate.date();
        const halfCellWidth = cellWidth / 2;
        const currentDayPosition = currentDay * cellWidth + halfCellWidth;

        // Calculate the initial position to center on the current day 
        // and ensure that it's not out of bounds
        const initialPosition = Math.min(0, (containerWidth / 2) - currentDayPosition);

        // Set the initial position of the slider elements
        draggableRefA.current.style.left = `${initialPosition}px`;
        draggableRefB.current.style.left = `${initialPosition + draggableRefA.current.offsetWidth}px`;

        // Ensure that this effect runs only once
        // since we intentionally use an empty dependency array
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const momentDateStringA = agendaSettings.momentA ? agendaSettings.momentA.format('YYYY-MM-DD') : '';
    const momentDateStringB = agendaSettings.momentB ? agendaSettings.momentB.format('YYYY-MM-DD') : '';

    return (
        <>
            <StecDiv className={'stec-layout-agenda-slider'}>

                <StecDiv ref={containerRef}>

                    <AgendaSliderContent
                        activeCell={agendaSettings.activeCell}
                        workerThread={`AgendaSliderContentA_${instanceId}`}
                        ref={draggableRefA}
                        momentDate={momentDateStringA}
                        onCellClick={cellDateString => {

                            const cellMoment = moment(cellDateString);

                            if (cellMoment.month() !== calendarMoment.month()) {
                                const newMoment = moment(cellMoment).startOf('month');
                                setCalendarMoment(newMoment);
                            }

                            if (false === isDragging.current) {
                                toggleCellEventsHolder(cellMoment);
                            }
                        }}

                        onEventsReady={(events) => {
                            setEventsA(events);
                        }}
                    />

                    <AgendaSliderContent
                        activeCell={agendaSettings.activeCell}
                        workerThread={`AgendaSliderContentB_${instanceId}`}
                        ref={draggableRefB}
                        momentDate={momentDateStringB}
                        onCellClick={cellDateString => {

                            const cellMoment = moment(cellDateString);

                            if (cellMoment.month() !== calendarMoment.month()) {

                                const newMoment = moment(cellMoment).startOf('month');

                                setCalendarMoment(newMoment);
                            }

                            if (false === isDragging.current) {
                                toggleCellEventsHolder(cellMoment);
                            }
                        }}
                        onEventsReady={(events) => {
                            setEventsB(events);
                        }}
                    />

                </StecDiv>

            </StecDiv>

            <AgendaSliderEventsHolder
                key={agendaSettings.activeCell ? `agenda-slider-events-preview-${agendaSettings.activeCell.moment.format('YMD')}` : ''}
                eventsA={eventsA}
                eventsB={eventsB}
                activeMoment={agendaSettings?.activeCell?.moment ? agendaSettings.activeCell.moment : false}
            />
        </>
    )
}

export default AgendaSlider