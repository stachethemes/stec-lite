import Button from '@Stec/CommonComponents/Button';
import ConfirmResetSettingsButton from '@Stec/CommonComponents/ConfirmResetSettingsButton';
import ErrorBoundary from '@Stec/CommonComponents/ErrorBoundary';
import FieldDescription from '@Stec/CommonComponents/FieldDescription';
import FieldTitle from '@Stec/CommonComponents/FieldTitle';
import PageHeading from '@Stec/CommonComponents/PageHeading';
import Section from '@Stec/CommonComponents/Section';
import SideNavigation from '@Stec/CommonComponents/SideNavigation';
import Spacer from '@Stec/CommonComponents/Spacer';
import { newApiDelete, newApiPost } from '@Stec/JS/api';
import { useSettings } from '@Stec/JS/dashboard/hooks';
import { useDashboardMenu } from '@Stec/JS/dashboard/hooks.js';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { cloneDeep } from 'lodash';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Calendar from './tabs/Calendar';
import Comments from './tabs/Comments';
import Dashboard from './tabs/Dashboard';
import FontsAndColors from './tabs/FontsAndColors';
import Language from './tabs/Language';
import Layouts from './tabs/Layouts';
import Map from './tabs/Map';
import Misc from './tabs/Misc';
import Pages from './tabs/Pages';
import tabsList from './tabsList';

const FatalError = ({ resetSettings }) => {
    return (
        <Section>

            <FieldTitle text={__('Unable to display calendar settings. Reset to default settings?', 'stachethemes_event_calendar_lite')} />
            <FieldDescription text={__(`If resetting the settings doesn't resolve the issue, please contact our support team for further assistance`, 'stachethemes_event_calendar_lite')} />

            <Spacer />

            <Button className='yellow' label={__('Reset to defaults', 'stachethemes_event_calendar_lite')} onClick={()=>{
                resetSettings('');
            }} />

        </Section>
    )
}

const CurrentTabComponent = (props) => {

    switch (props.id) {

        case 'calendar': {
            return <Calendar settings={props.settings} />
        }

        case 'layouts': {
            return <Layouts settings={props.settings} />
        }

        case 'map': {
            return <Map settings={props.settings} />
        }

        case 'comments': {
            return <Comments settings={props.settings} />
        }

        // fonts_and_colors
        case 'fac': {
            return <FontsAndColors settings={props.settings} />
        }

        case 'dashboard': {
            return <Dashboard settings={props.settings} />
        }

        // language
        case 'lang': {
            return <Language settings={props.settings} />
        }

        case 'pages': {
            return <Pages settings={props.settings} />
        }

        case 'misc': {
            return <Misc settings={props.settings} />
        }

        default: {
            return '';
        }
    }

}

const SettingsRender = ({ settings, tabs, setTabs, onSave, onReset }) => {

    const { setActiveMenu } = useDashboardMenu();

    // component id is equal to the setting key in the php settings file
    const componentId = tabs.filter(item => item.active === true)[0].id;

    return (
        <>

            <StecDiv className='stec-dashboard-top-nav'>

                <Button className='yellow stec-dashboard-home-button' label={[<i key='icon' className='fa-solid fa-house' />, __('Home', 'stachethemes_event_calendar_lite')]} onClick={() => {
                    setActiveMenu({
                        page: 'home',
                        params: {}
                    });
                }} />

            </StecDiv>

            <PageHeading label={[
                <i key='icon' className='fa-solid fa-wrench' />,
                __('Manage settings', 'stachethemes_event_calendar_lite')]} />

            <StecDiv className='stec-dashboard-settings-wrapper'>

                <SideNavigation items={tabs} setItems={setTabs} />

                <StecDiv className='stec-dashboard-settings-component-container'>

                    <ErrorBoundary errorComponent={<FatalError resetSettings={onReset} />}>

                        <CurrentTabComponent id={componentId} settings={settings} />

                        <Spacer />

                        <Button className='green' label={__('Save settings', 'stachethemes_event_calendar_lite')} onClick={() => {
                            onSave(settings)
                        }} />

                        <ConfirmResetSettingsButton
                            style={{ marginLeft: 6 }}
                            className='yellow'
                            section={componentId}
                            onClick={onReset} />


                    </ErrorBoundary>

                </StecDiv>


            </StecDiv>
        </>
    )

}

const SettingsReady = ({ tabs, setTabs, settings }) => {

    const [instance, setInstance] = useState(0);
    const blockActionRef = useRef(false);
    const editableSettings = useRef(cloneDeep(settings));

    const saveSettings = (settingsData) => {

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function updateSettings() {

                    try {

                        let result;

                        result = await newApiPost({
                            route: 'SETTINGS',
                            data: {
                                settings: settingsData.current
                            },
                            includeResponseStatus: true
                        });

                        const { status, data } = result;

                        editableSettings.current = data;

                        const d = new Date();

                        setInstance(d.getTime());

                        return resolve(__('Settings updated', 'stachethemes_event_calendar_lite'));

                    } catch (e) {

                        return reject(e.message);
                    }

                }

                updateSettings();

            }),
            {
                loading: __('Updating settings', 'stachethemes_event_calendar_lite'),

                success: (successMessage) => {
                    blockActionRef.current = false;
                    return successMessage;
                },

                error: (errorMessage) => {
                    blockActionRef.current = false;
                    return <StecDiv dangerouslySetInnerHTML={{ __html: errorMessage }} />;
                },
            }
        );

    }

    const resetSettings = (section) => {

        toast.promise(

            new Promise((resolve, reject) => {

                blockActionRef.current = true;

                async function deleteSettings() {

                    try {

                        let result;

                        result = await newApiDelete({
                            route: 'SETTINGS',
                            args: section ? `?section=${section}` : '',
                            includeResponseStatus: true
                        });

                        const { status, data } = result;

                        editableSettings.current = data;

                        const d = new Date();

                        setInstance(d.getTime());

                        return resolve(__('Settings have been reset', 'stachethemes_event_calendar_lite'));

                    } catch (e) {

                        return reject(e.message);
                    }

                }

                deleteSettings();

            }),
            {
                loading: __('Updating settings', 'stachethemes_event_calendar_lite'),

                success: (successMessage) => {
                    blockActionRef.current = false;
                    return successMessage;
                },

                error: (errorMessage) => {
                    blockActionRef.current = false;
                    return <StecDiv dangerouslySetInnerHTML={{ __html: errorMessage }} />;
                },
            }
        );


    }

    return (
        <SettingsRender key={instance} tabs={tabs} setTabs={setTabs} settings={editableSettings} onSave={saveSettings} onReset={resetSettings} />
    )
}

function Settings() {

    const { settings, ready, error } = useSettings();

    const filterTabsList = tabsList.filter(tab => {

        // filters out tabs that are not enabled

        return true;
    });

    const [tabs, setTabs] = useState(filterTabsList);

    if (false === ready || true === error) {
        return null;
    }

    return <SettingsReady tabs={tabs} setTabs={setTabs} settings={settings} />

}

export default Settings