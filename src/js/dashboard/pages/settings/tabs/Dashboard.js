import { UncontrolledInputCheckbox } from '@Stec/CommonComponents/InputCheckbox';
import { UncontrolledInputSelect } from '@Stec/CommonComponents/InputSelect';
import Section from '@Stec/CommonComponents/Section';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { usePermissions } from '@Stec/JS/hooks';
import { __ } from '@wordpress/i18n';
import MaybeFilter from '../../../MaybeFilter';
import { getPropsKeywords, getSectionKeywords } from '../filterMap';

function Dashboard({ settings, searchValue }) {

    const settingsDashboard = settings.current.dashboard;

    const { items: permissionsList, ready, error } = usePermissions();

    if (true !== ready) {
        return null;
    }

    const permissionsListFiltered = permissionsList.filter((item) => {

        const exclude = ['stec_private', 'stec_bp'];

        return false === exclude.includes(item.value) && false === item.value.includes('stec_bp');
    });

    const permissionsListFilteredNoPublic = permissionsListFiltered.filter((item) => {
        return item.value !== 'stec_public';
    });

    return (
        <Section>

            <MaybeFilter searchValue={searchValue} keywords={getSectionKeywords('dashboard', 'dashboard')}>
                <SectionCollapseContent title={__('Dashboard settings', 'stachethemes_event_calendar_lite')} subtitle={__('Show dashboard settings', 'stachethemes_event_calendar_lite')}>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('dashboard', 'dashboard', 'access')}>
                        <UncontrolledInputSelect
                            multiple={true}
                            defaultValue={settingsDashboard.access}
                            title={__('Access dashboard', 'stachethemes_event_calendar_lite')}
                            options={permissionsListFilteredNoPublic}
                            onChange={value => {
                                settingsDashboard.access = value;
                            }}
                            description={__('Select user roles permitted to access the dashboard', 'stachethemes_event_calendar_lite')}
                        />

                        <Spacer />
                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('dashboard', 'dashboard', 'manage_stec_cal')}>

                        <UncontrolledInputSelect
                            multiple={true}
                            defaultValue={settingsDashboard.manage_stec_cal}
                            title={__('Manage calendars', 'stachethemes_event_calendar_lite')}
                            options={permissionsListFiltered}
                            onChange={value => {
                                settingsDashboard.manage_stec_cal = value;
                            }}
                            description={__('Select user roles permitted to submit and manage calendars', 'stachethemes_event_calendar_lite')}
                        />

                        <Spacer />

                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('dashboard', 'dashboard', 'manage_stec_cat')}>

                        <UncontrolledInputSelect
                            multiple={true}
                            defaultValue={settingsDashboard.manage_stec_cat}
                            title={__('Manage categories', 'stachethemes_event_calendar_lite')}
                            options={permissionsListFiltered}
                            onChange={value => {
                                settingsDashboard.manage_stec_cat = value;
                            }}
                            description={__('Select user roles permitted to submit and manage categories', 'stachethemes_event_calendar_lite')}
                        />

                        <Spacer />

                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('dashboard', 'dashboard', 'manage_stec_loc')}>

                        <UncontrolledInputSelect
                            multiple={true}
                            defaultValue={settingsDashboard.manage_stec_loc}
                            title={__('Manage locations', 'stachethemes_event_calendar_lite')}
                            options={permissionsListFiltered}
                            onChange={value => {
                                settingsDashboard.manage_stec_loc = value;
                            }}
                            description={__('Select user roles permitted to submit and manage locations', 'stachethemes_event_calendar_lite')}
                        />

                        <Spacer />

                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('dashboard', 'dashboard', 'manage_stec_org')}>

                        <UncontrolledInputSelect
                            multiple={true}
                            defaultValue={settingsDashboard.manage_stec_org}
                            title={__('Manage organizers', 'stachethemes_event_calendar_lite')}
                            options={permissionsListFiltered}
                            onChange={value => {
                                settingsDashboard.manage_stec_org = value;
                            }}
                            description={__('Select user roles permitted to submit and manage organizers', 'stachethemes_event_calendar_lite')}
                        />

                        <Spacer />

                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('dashboard', 'dashboard', 'manage_stec_gst')}>

                        <UncontrolledInputSelect
                            multiple={true}
                            defaultValue={settingsDashboard.manage_stec_gst}
                            title={__('Manage guests', 'stachethemes_event_calendar_lite')}
                            options={permissionsListFiltered}
                            onChange={value => {
                                settingsDashboard.manage_stec_gst = value;
                            }}
                            description={__('Select user roles permitted to submit and manage guests', 'stachethemes_event_calendar_lite')}
                        />

                        <Spacer />

                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('dashboard', 'dashboard', 'manage_events')}>

                        <UncontrolledInputSelect
                            multiple={true}
                            defaultValue={settingsDashboard.manage_events}
                            title={__('Manage events', 'stachethemes_event_calendar_lite')}
                            options={permissionsListFiltered}
                            onChange={value => {
                                settingsDashboard.manage_events = value;
                            }}
                            description={__('Select user roles permitted to submit and manage events', 'stachethemes_event_calendar_lite')}
                        />

                        <Spacer />

                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('dashboard', 'dashboard', 'manage_settings')}>

                        <UncontrolledInputSelect
                            multiple={true}
                            defaultValue={settingsDashboard.manage_settings}
                            title={__('Manage settings', 'stachethemes_event_calendar_lite')}
                            options={permissionsListFilteredNoPublic}
                            onChange={value => {
                                settingsDashboard.manage_settings = value;
                            }}
                            description={__('Select user roles permitted to edit the plugin settings', 'stachethemes_event_calendar_lite')}
                        />

                        <Spacer />

                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('dashboard', 'dashboard', 'in_calendar')}>

                        <UncontrolledInputCheckbox
                            defaultValue={settingsDashboard.in_calendar}
                            title={__('In calendar dashboard', 'stachethemes_event_calendar_lite')}
                            description={__('Allow access to the dashboard from the front-end calendar', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsDashboard.in_calendar = true === value;
                            }}
                        />

                        <Spacer />

                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('dashboard', 'dashboard', 'wpmedia')}>

                        <UncontrolledInputCheckbox
                            defaultValue={settingsDashboard.wpmedia}
                            title={__('Load WP Media on the front-end', 'stachethemes_event_calendar_lite')}
                            description={__('Allow users to access the WordPress Media Library on the front-end', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsDashboard.wpmedia = true === value;
                            }}
                        />

                        <Spacer />

                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('dashboard', 'dashboard', 'enforce_private_admin')}>

                        <UncontrolledInputCheckbox
                            defaultValue={settingsDashboard.enforce_private_admin}
                            title={__('Enforce private back-end', 'stachethemes_event_calendar_lite')}
                            description={__('If enabled, terms and events permissions will be restricted to Private mode, allowing only their authors to edit, view and use them', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsDashboard.enforce_private_admin = true === value;
                            }}
                        />

                        <Spacer />

                    </MaybeFilter>

                    <MaybeFilter searchValue={searchValue} keywords={getPropsKeywords('dashboard', 'dashboard', 'enforce_private_front')}>

                        <UncontrolledInputCheckbox
                            defaultValue={settingsDashboard.enforce_private_front}
                            title={__('Enforce private front-end', 'stachethemes_event_calendar_lite')}
                            description={__('If enabled, terms and events will be visible on the front-end only by their author', 'stachethemes_event_calendar_lite')}
                            onChange={value => {
                                settingsDashboard.enforce_private_front = true === value;
                            }}
                        />

                    </MaybeFilter>

                </SectionCollapseContent>
            </MaybeFilter>
        </Section >
    )
}

export default Dashboard;