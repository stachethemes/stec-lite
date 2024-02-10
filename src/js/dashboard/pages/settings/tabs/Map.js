import { InputSelect } from '@Stec/CommonComponents/InputSelect';
import { UncontrolledInputText } from '@Stec/CommonComponents/InputText';
import { UncontrolledQtySelector } from '@Stec/CommonComponents/QtySelector';
import Section from '@Stec/CommonComponents/Section';
import SectionCollapseContent from '@Stec/CommonComponents/SectionCollapseContent';
import Spacer from '@Stec/CommonComponents/Spacer';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

function Map({ settings }) {

    const settingsMap = settings.current.map;
    const settingsLayouts = settings.current.layouts;
    const [mapProvider, setMapProvider] = useState(settingsMap.type);

    return (
        <Section>
            <SectionCollapseContent title={__('Map settings', 'stachethemes_event_calendar_lite')} subtitle={__('Show map settings', 'stachethemes_event_calendar_lite')}>
                <InputSelect
                    value={mapProvider}
                    title={__('Map provider', 'stachethemes_event_calendar_lite')}
                    description={__(`Choose your map provider`, 'stachethemes_event_calendar_lite')}
                    options={[
                        {
                            value: 'osm',
                            label: __('Open Street Map', 'stachethemes_event_calendar_lite')
                        },
                        {
                            value: 'gmap',
                            label: __('Google Maps', 'stachethemes_event_calendar_lite')
                        }
                    ]}
                    onChange={value => {
                        settingsMap.type = value;
                        setMapProvider(value);
                    }}
                />

                {
                    'gmap' === mapProvider &&
                    <>
                        <Spacer />
                        <UncontrolledInputText
                            title={__('API Key', 'stachethemes_event_calendar_lite')}
                            description={__('Enter your google maps API key', 'stachethemes_event_calendar_lite')}
                            defaultValue={settingsMap.gmap_api_key}
                            onChange={value => {
                                settingsMap.gmap_api_key = value;
                            }}
                        />
                    </>
                }

                <Spacer />

                <UncontrolledQtySelector
                    title={__('Map zoom', 'stachethemes_event_calendar_lite')}
                    min={1}
                    max={20}
                    defaultValue={settingsLayouts.map_zoom}
                    onChange={value => {
                        settingsLayouts.map_zoom = value;
                    }}
                    description={__('Initial map zoom value', 'stachethemes_event_calendar_lite')}
                />

            </SectionCollapseContent>

        </Section>
    )
}

export default Map;