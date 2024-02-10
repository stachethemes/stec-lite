import { UncontrolledInputCheckbox } from '@Stec/CommonComponents/InputCheckbox';
import { UncontrolledInputSelect } from '@Stec/CommonComponents/InputSelect';
import Section from '@Stec/CommonComponents/Section';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { usePermissions } from '@Stec/JS/hooks';
import { __ } from '@wordpress/i18n';

function Dashboard({ settings }) {

    const settingsDashboard = settings.current.dashboard;

    const { items: permissionsList, ready, error } = usePermissions();

    if (true !== ready) {
        return null;
    }

    const permissionsListFiltered = permissionsList.filter((item) => {

        const exclude = ['stec_public', 'stec_private', 'stec_bp'];

        return false === exclude.includes(item.value) && false === item.value.includes('stec_bp');
    });

    return (
        <Section>
            <SectionCollapseContent title={__('Dashboard settings', 'stachethemes_event_calendar_lite')} subtitle={__('Show dashboard settings', 'stachethemes_event_calendar_lite')}>

                <UncontrolledInputSelect
                    multiple={true}
                    defaultValue={settingsDashboard.access}
                    title={__('Access dashboard', 'stachethemes_event_calendar_lite')}
                    options={permissionsListFiltered}
                    onChange={value => {
                        settingsDashboard.access = value;
                    }}
                    description={__('Who can access the dashboard', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledInputSelect
                    multiple={true}
                    defaultValue={settingsDashboard.manage_terms}
                    title={__('Manage terms', 'stachethemes_event_calendar_lite')}
                    options={permissionsListFiltered}
                    onChange={value => {
                        settingsDashboard.manage_terms = value;
                    }}
                    description={__('Only selected roles will be allowed to add new terms', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledInputSelect
                    multiple={true}
                    defaultValue={settingsDashboard.manage_events}
                    title={__('Manage events', 'stachethemes_event_calendar_lite')}
                    options={permissionsListFiltered}
                    onChange={value => {
                        settingsDashboard.manage_events = value;
                    }}
                    description={__('Only selected roles will be allowed to manage events', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledInputSelect
                    multiple={true}
                    defaultValue={settingsDashboard.manage_settings}
                    title={__('Manage settings', 'stachethemes_event_calendar_lite')}
                    options={permissionsListFiltered}
                    onChange={value => {
                        settingsDashboard.manage_settings = value;
                    }}
                    description={__('Only selected roles will be allowed access to the settings', 'stachethemes_event_calendar_lite')}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    defaultValue={settingsDashboard.in_calendar}
                    title={__('In calendar dashboard')}
                    description={__('Allow access to the dashboard from the front-end calendar')}
                    onChange={value => {
                        settingsDashboard.in_calendar = true === value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    defaultValue={settingsDashboard.wpmedia}
                    title={__('Load WP Media on the front-end', 'stachethemes_event_calendar_lite')}
                    description={__('Allow users to access the WordPress Media Library on the front-end', 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        settingsDashboard.wpmedia = true === value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    defaultValue={settingsDashboard.enforce_private_admin}
                    title={__('Enforce private back-end', 'stachethemes_event_calendar_lite')}
                    description={__('If enabled, terms and events permissions will be restricted to Private mode, allowing only their authors to edit, view and use them', 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        settingsDashboard.enforce_private_admin = true === value;
                    }}
                />

                <Spacer />

                <UncontrolledInputCheckbox
                    defaultValue={settingsDashboard.enforce_private_front}
                    title={__('Enforce private front-end', 'stachethemes_event_calendar_lite')}
                    description={__('If enabled, terms and events will be visible on the front-end only by their author', 'stachethemes_event_calendar_lite')}
                    onChange={value => {
                        settingsDashboard.enforce_private_front = true === value;
                    }}
                />

            </SectionCollapseContent>
        </Section >
    )
}

export default Dashboard;