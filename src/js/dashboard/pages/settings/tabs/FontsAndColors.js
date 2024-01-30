import Button from '@Stec/CommonComponents/Button';
import Flexbox from '@Stec/CommonComponents/Flexbox';
import Grid from '@Stec/CommonComponents/Grid';
import { UncontrolledInputColor } from '@Stec/CommonComponents/InputColor';
import { UncontrolledInputSelect } from '@Stec/CommonComponents/InputSelect';
import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import { UncontrolledInputTextarea } from '@Stec/CommonComponents/InputTextarea';
import { UncontrolledQtySelector } from '@Stec/CommonComponents/QtySelector';
import Section from '@Stec/CommonComponents/Section';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { StecDiv } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import * as themes from './themes';

function FontsAndColors({ settings }) {

    const [sectionKey, setSectionKey] = useState(0);
    const theme = useRef('');
    const settingsFac = settings.current.fac;

    const applyTheme = () => {

        if (!theme.current || typeof themes[theme.current] !== 'object') {
            return;
        }

        settings.current.fac = { ...settings.current.fac, ...themes[theme.current] };

        const d = new Date();
        setSectionKey(d.getTime());
        toast(__('Colors scheme applied', 'stec'))

    }

    const getThemeColorsPalette = (colorsArray) => {

        const palette = [];

        colorsArray.forEach(color => {

            const style = {
                backgroundColor: color,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.3)',
                marginLeft: color === colorsArray[0] ? 10 : 5,
                float: 'left'
            };

            palette.push(
                <StecDiv key={color} title={color} style={style} />
            );

        });

        return palette;

    }

    const getGenerateListItemLabel = (text, colorsArray) => {

        const label = <StecDiv key='label' style={{ maxWidth: '220px' }}>{text}</StecDiv>;
        const colors = getThemeColorsPalette(colorsArray);
        const flexStyle = {
            width: '100%',
            justifyContent: 'space-between',
        };

        return <Flexbox style={flexStyle}>
            {label}
            <StecDiv>
                {colors}
            </StecDiv>
        </Flexbox>

    }

    const optionsList = [
        {
            search: __('Apple Red on White', 'stec'),
            label: getGenerateListItemLabel(__('Apple Red on White', 'stec'), ['#ED1C23', '#4D4F53', '#BDC1C8', '#ffffff']),
            value: 'apple_red_on_white'
        },
        {
            search: __('Orange on Dark Gray', 'stec'),
            label: getGenerateListItemLabel(__('Orange on Dark Gray', 'stec'), ['#ff7900', '#f2ad72', '#d9d9d9', '#464646']),
            value: 'orange_on_dark_gray'
        },
        {
            search: __('Yellow on White', 'stec'),
            label: getGenerateListItemLabel(__('Yellow on White', 'stec'), ['#ffc068', '#505050', '#E5E5E5', '#ffffff']),
            value: 'yellow_on_white'
        },
        {
            search: __('Green on White', 'stec'),
            label: getGenerateListItemLabel(__('Green on White', 'stec'), ['#8dc06c', '#da645a', '#505050', '#f3f4f7', '#ffffff']),
            value: 'green_on_white'
        },
        {
            search: __('Violet on White', 'stec'),
            label: getGenerateListItemLabel(__('Violet on White', 'stec'), ['#8d43e7', '#da645a', '#505050', '#f3f4f7', '#ffffff']),
            value: 'violet_on_white'
        },
        {
            search: __('Autumn Theme on White', 'stec'),
            label: getGenerateListItemLabel(__('Autumn Theme on White', 'stec'), ['#588c73', '#da645a', '#f2ae72', '#f3f4f7', '#ffffff']),
            value: 'autumn_theme_on_white'
        },
        {
            search: __('Mono', 'stec'),
            label: getGenerateListItemLabel(__('Mono', 'stec'), ['#202020', '#606060', '#ececec', '#f5f5f5', '#525252', '#fff']),
            value: 'mono'
        },

        {
            search: __('Default Theme', 'stec'),
            label: getGenerateListItemLabel(__('Default Theme', 'stec'), ['#ff5f5f', '#eb4b4b', '#454850', '#f5f5f5', '#ffffff']),
            value: 'default_theme'
        },
    ];

    return (
        <Section>

            <SectionCollapseContent
                collapsed={true}
                title={__('Themes', 'stec')} subtitle={__('Show themes settings', 'stec')}>

                <UncontrolledInputSelect
                    title={__('Color Themes', 'stec')}
                    value={theme.current}
                    options={optionsList}
                    onChange={value => {
                        theme.current = value;
                    }}
                />

                <Spacer />

                <Button label={__('Apply theme colors', 'stec')} className='blue' onClick={() => {
                    applyTheme();
                }} />

            </SectionCollapseContent>

            <Spacer />

            <StecDiv key={sectionKey}>

                <SectionCollapseContent
                    collapsed={true}
                    title={__('Fonts', 'stec')} subtitle={__('Show fonts menu settings', 'stec')}>

                    <UncontrolledInputText
                        title={__('General font family', 'stec')}
                        placeholder={__('Font family', 'stec')}
                        defaultValue={settingsFac['font-general']}
                        onChange={value => {
                            settingsFac['font-general'] = value;
                        }}
                    />

                </SectionCollapseContent>


                <SectionCollapseContent
                    collapsed={true}
                    title={__('Top menu', 'stec')} subtitle={__('Show top menu settings', 'stec')}>

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Background color', 'stec')}
                            defaultValue={settingsFac['top-menu-bg']}
                            onChange={value => {
                                settingsFac['top-menu-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Background color (Active Primary)', 'stec')}
                            defaultValue={settingsFac['top-menu-bg-active-primary']}
                            onChange={value => {
                                settingsFac['top-menu-bg-active-primary'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Background color (Active Secondary)', 'stec')}
                            defaultValue={settingsFac['top-menu-bg-active-secondary']}
                            onChange={value => {
                                settingsFac['top-menu-bg-active-secondary'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Text color', 'stec')}
                            defaultValue={settingsFac['top-menu-color']}
                            onChange={value => {
                                settingsFac['top-menu-color'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Text color (Active)', 'stec')}
                            defaultValue={settingsFac['top-menu-color-active']}
                            onChange={value => {
                                settingsFac['top-menu-color-active'] = value;
                            }}
                        />

                    </Grid>

                </SectionCollapseContent>

                <SectionCollapseContent
                    collapsed={true}
                    title={__('Agenda', 'stec')} subtitle={__('Show agenda settings', 'stec')}>

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Agenda list title color', 'stec')}
                            defaultValue={settingsFac['agenda-list-title-color']}
                            onChange={value => {
                                settingsFac['agenda-list-title-color'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Month and Year cell background color', 'stec')}
                            defaultValue={settingsFac['agenda-month-year-bg']}
                            onChange={value => {
                                settingsFac['agenda-month-year-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Month and Year cell text color', 'stec')}
                            defaultValue={settingsFac['agenda-month-year-color']}
                            onChange={value => {
                                settingsFac['agenda-month-year-color'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Cell background color', 'stec')}
                            defaultValue={settingsFac['agenda-cell-bg']}
                            onChange={value => {
                                settingsFac['agenda-cell-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Cell text color', 'stec')}
                            defaultValue={settingsFac['agenda-cell-color']}
                            onChange={value => {
                                settingsFac['agenda-cell-color'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Cell background color (Hover)', 'stec')}
                            defaultValue={settingsFac['agenda-cell-bg-hover']}
                            onChange={value => {
                                settingsFac['agenda-cell-bg-hover'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Cell text color (Hover)', 'stec')}
                            defaultValue={settingsFac['agenda-cell-color-hover']}
                            onChange={value => {
                                settingsFac['agenda-cell-color-hover'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Cell background color (Active)', 'stec')}
                            defaultValue={settingsFac['agenda-cell-bg-active']}
                            onChange={value => {
                                settingsFac['agenda-cell-bg-active'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Cell text color (Active)', 'stec')}
                            defaultValue={settingsFac['agenda-cell-color-active']}
                            onChange={value => {
                                settingsFac['agenda-cell-color-active'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Cell today background color', 'stec')}
                            defaultValue={settingsFac['agenda-cell-today-bg']}
                            onChange={value => {
                                settingsFac['agenda-cell-today-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Cell today text color', 'stec')}
                            defaultValue={settingsFac['agenda-cell-today-color']}
                            onChange={value => {
                                settingsFac['agenda-cell-today-color'] = value;
                            }}
                        />

                    </Grid>

                </SectionCollapseContent>

                <SectionCollapseContent
                    collapsed={true}
                    title={__('Month & Week', 'stec')} subtitle={__('Show month & week settings', 'stec')}>

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Legend background color', 'stec')}
                            defaultValue={settingsFac['mw-legend-bg']}
                            onChange={value => {
                                settingsFac['mw-legend-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Legend text color', 'stec')}
                            defaultValue={settingsFac['mw-legend-color']}
                            onChange={value => {
                                settingsFac['mw-legend-color'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Legend background color (Today)', 'stec')}
                            defaultValue={settingsFac['mw-legend-today-bg']}
                            onChange={value => {
                                settingsFac['mw-legend-today-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Legend text color (Today)', 'stec')}
                            defaultValue={settingsFac['mw-legend-today-color']}
                            onChange={value => {
                                settingsFac['mw-legend-today-color'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Cell background color', 'stec')}
                            defaultValue={settingsFac['mw-cell-bg']}
                            onChange={value => {
                                settingsFac['mw-cell-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Cell text color', 'stec')}
                            defaultValue={settingsFac['mw-cell-color']}
                            onChange={value => {
                                settingsFac['mw-cell-color'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Cell background color (Hover)', 'stec')}
                            defaultValue={settingsFac['mw-cell-bg-hover']}
                            onChange={value => {
                                settingsFac['mw-cell-bg-hover'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Cell text color (Hover)', 'stec')}
                            defaultValue={settingsFac['mw-cell-color-hover']}
                            onChange={value => {
                                settingsFac['mw-cell-color-hover'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Cell background color (Active)', 'stec')}
                            defaultValue={settingsFac['mw-cell-bg-active']}
                            onChange={value => {
                                settingsFac['mw-cell-bg-active'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Cell text color (Active)', 'stec')}
                            defaultValue={settingsFac['mw-cell-color-active']}
                            onChange={value => {
                                settingsFac['mw-cell-color-active'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Different month cell background color', 'stec')}
                            defaultValue={settingsFac['mw-cell-diff-bg']}
                            onChange={value => {
                                settingsFac['mw-cell-diff-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Different month cell text color', 'stec')}
                            defaultValue={settingsFac['mw-cell-diff-color']}
                            onChange={value => {
                                settingsFac['mw-cell-diff-color'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Today cell text background color', 'stec')}
                            defaultValue={settingsFac['mw-cell-today-bg']}
                            onChange={value => {
                                settingsFac['mw-cell-today-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Today cell text color', 'stec')}
                            defaultValue={settingsFac['mw-cell-today-color']}
                            onChange={value => {
                                settingsFac['mw-cell-today-color'] = value;
                            }}
                        />

                    </Grid>

                </SectionCollapseContent>

                <SectionCollapseContent
                    collapsed={true}
                    title={__('Grid', 'stec')} subtitle={__('Show grid settings', 'stec')}>

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Background color', 'stec')}
                            defaultValue={settingsFac['grid-bg']}
                            onChange={value => {
                                settingsFac['grid-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Border color', 'stec')}
                            defaultValue={settingsFac['grid-border-color']}
                            onChange={value => {
                                settingsFac['grid-border-color'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Title color', 'stec')}
                            defaultValue={settingsFac['grid-title-color']}
                            onChange={value => {
                                settingsFac['grid-title-color'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Text color', 'stec')}
                            defaultValue={settingsFac['grid-text-color']}
                            onChange={value => {
                                settingsFac['grid-text-color'] = value;
                            }}
                        />

                    </Grid>


                </SectionCollapseContent>

                <SectionCollapseContent
                    collapsed={true}
                    title={__('Box Grid', 'stec')} subtitle={__('Show box grid settings', 'stec')}>

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Title color', 'stec')}
                            defaultValue={settingsFac['boxgrid-title-color']}
                            onChange={value => {
                                settingsFac['boxgrid-title-color'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Text color', 'stec')}
                            defaultValue={settingsFac['boxgrid-text-color']}
                            onChange={value => {
                                settingsFac['boxgrid-text-color'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <UncontrolledQtySelector
                        title={__('Background image dimness', 'stec')}
                        description={__('Adjust the background image dimness', 'stec')}
                        defaultValue={(settingsFac['boxgrid-dimness'] || 0) * 100}
                        min={0}
                        max={100}
                        onChange={value => {
                            settingsFac['boxgrid-dimness'] = value / 100;
                        }}
                    />

                    <Spacer />

                    <UncontrolledQtySelector
                        title={__('Background image dimness (hover)', 'stec')}
                        description={__('Adjust the background image dimness on hover', 'stec')}
                        defaultValue={(settingsFac['boxgrid-dimness-hover'] || 0) * 100}
                        min={0}
                        max={100}
                        onChange={value => {
                            settingsFac['boxgrid-dimness-hover'] = value / 100;
                        }}
                    />

                </SectionCollapseContent>

                <SectionCollapseContent
                    collapsed={true}
                    title={__('Event Preview', 'stec')} subtitle={__('Show event preview settings', 'stec')}>

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Background color', 'stec')}
                            defaultValue={settingsFac['ep-bg']}
                            onChange={value => {
                                settingsFac['ep-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Background color (Hover)', 'stec')}
                            defaultValue={settingsFac['ep-bg-hover']}
                            onChange={value => {
                                settingsFac['ep-bg-hover'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Title color', 'stec')}
                            defaultValue={settingsFac['ep-title-color']}
                            onChange={value => {
                                settingsFac['ep-title-color'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Title color (Hover)', 'stec')}
                            defaultValue={settingsFac['ep-title-color-hover']}
                            onChange={value => {
                                settingsFac['ep-title-color-hover'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Text color', 'stec')}
                            defaultValue={settingsFac['ep-text-color']}
                            onChange={value => {
                                settingsFac['ep-text-color'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Text color (Hover)', 'stec')}
                            defaultValue={settingsFac['ep-text-color-hover']}
                            onChange={value => {
                                settingsFac['ep-text-color-hover'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Buttons color', 'stec')}
                            defaultValue={settingsFac['ep-button-color']}
                            onChange={value => {
                                settingsFac['ep-button-color'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Buttons color (Hover)', 'stec')}
                            defaultValue={settingsFac['ep-button-color-hover']}
                            onChange={value => {
                                settingsFac['ep-button-color-hover'] = value;
                            }}
                        />

                    </Grid>


                </SectionCollapseContent>

                <SectionCollapseContent
                    collapsed={true}
                    title={__('Event Content', 'stec')} subtitle={__('Show event content settings', 'stec')}>

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Background color', 'stec')}
                            defaultValue={settingsFac['ec-bg']}
                            onChange={value => {
                                settingsFac['ec-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Text color', 'stec')}
                            defaultValue={settingsFac['ec-text-color']}
                            onChange={value => {
                                settingsFac['ec-text-color'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Title color', 'stec')}
                            defaultValue={settingsFac['ec-title-color']}
                            onChange={value => {
                                settingsFac['ec-title-color'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Secondary title color', 'stec')}
                            defaultValue={settingsFac['ec-title-secondary-color']}
                            onChange={value => {
                                settingsFac['ec-title-secondary-color'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Tab menu background', 'stec')}
                            defaultValue={settingsFac['ec-tab-menu-bg']}
                            onChange={value => {
                                settingsFac['ec-tab-menu-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Tab menu background (Active)', 'stec')}
                            defaultValue={settingsFac['ec-tab-menu-bg-active']}
                            onChange={value => {
                                settingsFac['ec-tab-menu-bg-active'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Tab menu text color', 'stec')}
                            defaultValue={settingsFac['ec-tab-menu-color']}
                            onChange={value => {
                                settingsFac['ec-tab-menu-color'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Tab menu text color (Active)', 'stec')}
                            defaultValue={settingsFac['ec-tab-menu-color-active']}
                            onChange={value => {
                                settingsFac['ec-tab-menu-color-active'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Button background color', 'stec')}
                            defaultValue={settingsFac['ec-button-bg']}
                            onChange={value => {
                                settingsFac['ec-button-bg'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Button background color (Hover)', 'stec')}
                            defaultValue={settingsFac['ec-button-bg-hover']}
                            onChange={value => {
                                settingsFac['ec-button-bg-hover'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Button text color', 'stec')}
                            defaultValue={settingsFac['ec-button-color']}
                            onChange={value => {
                                settingsFac['ec-button-color'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Button text color (Hover)', 'stec')}
                            defaultValue={settingsFac['ec-button-color-hover']}
                            onChange={value => {
                                settingsFac['ec-button-color-hover'] = value;
                            }}
                        />

                    </Grid>

                    <Spacer />

                    <Grid gap={20} columns='repeat( auto-fit, minmax(250px, 1fr) )'>

                        <UncontrolledInputColor
                            title={__('Toggle button text color', 'stec')}
                            defaultValue={settingsFac['ec-button-toggle-color']}
                            onChange={value => {
                                settingsFac['ec-button-toggle-color'] = value;
                            }}
                        />

                        <UncontrolledInputColor
                            title={__('Toggle button text color (Hover)', 'stec')}
                            defaultValue={settingsFac['ec-button-toggle-color-hover']}
                            onChange={value => {
                                settingsFac['ec-button-toggle-color-hover'] = value;
                            }}
                        />

                    </Grid>

                </SectionCollapseContent>

                <SectionCollapseContent
                    collapsed={true}
                    title={__('Advanced', 'stec')} subtitle={__('Show advanced settings', 'stec')}>

                    <UncontrolledInputTextarea
                        title={__('Custom Style', 'stec')}
                        defaultValue={settingsFac['custom-style']}
                        onChange={value => {
                            settingsFac['custom-style'] = value;
                        }}
                        description={__('Manually add custom CSS to the calendar', 'stec')}
                    />

                </SectionCollapseContent>

            </StecDiv>

        </Section >
    )
}

export default FontsAndColors;