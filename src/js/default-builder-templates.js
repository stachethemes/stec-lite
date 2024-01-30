// Default structures for event content
// used by src\js\calendar\hooks.js when obtaining the structure
// will revert to these structures if no templateId is provided

import { _x } from '@wordpress/i18n';

export const eventLayoutTemplate = [
    {
        "id": "element-1662912268522",
        "type": "ContentTabs",
        "children": [
            {
                "id": "element-1662912270707",
                "type": "ContentTab",
                "children": [
                    {
                        "id": "element-1662912426494",
                        "type": "Row",
                        "children": [
                            {
                                "id": "element-1662912428038",
                                "type": "Column",
                                "children": [
                                    {
                                        "id": "element-1662912437348",
                                        "type": "EventCounter",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {},
                                            "icon": "fa-solid fa-hourglass"
                                        },
                                        "label": "Event Counter"
                                    },
                                    {
                                        "id": "element-1662912442391",
                                        "type": "EventCarousel",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {
                                                "marginTop": 20
                                            },
                                            "icon": "fa-solid fa-images"
                                        },
                                        "label": "Media Carousel"
                                    },
                                    {
                                        "id": "element-1662912448269",
                                        "type": "EventTags",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {
                                                "marginTop": 20
                                            },
                                            "icon": "fa-solid fa-tags"
                                        },
                                        "label": "Event Tags"
                                    },
                                    {
                                        "id": "element-1662912454360",
                                        "type": "EventTitle",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "accepts": [],
                                            "settings": [
                                                "textAlign",
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {
                                                "marginTop": 20
                                            },
                                            "icon": "fa-solid fa-heading"
                                        },
                                        "label": "Event Title"
                                    },
                                    {
                                        "id": "element-1662912461686",
                                        "type": "HealthMeasures",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {
                                                "marginTop": 20
                                            },
                                            "icon": "fa-solid fa-shield-virus"
                                        },
                                        "label": "Health Measures"
                                    },
                                    {
                                        "id": "element-4329169999998808c3f044c1227788",
                                        "type": "EventDescription",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "accepts": [],
                                            "settings": [
                                                "textAlign",
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {
                                                "marginTop": 20
                                            },
                                            "icon": "fa-solid fa-align-left"
                                        },
                                        "label": "Description"
                                    },
                                    {
                                        "id": "element-1662912486152",
                                        "type": "EventExternalLink",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {
                                                "width": "100%",
                                                "marginTop": 20
                                            },
                                            "icon": "fa-solid fa-arrow-up-right-from-square"
                                        },
                                        "label": "External Link"
                                    },
                                    {
                                        "id": "element-1662912473139",
                                        "type": "EventOrganizers",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {
                                                "marginTop": 20
                                            },
                                            "icon": "fa-solid fa-user"
                                        },
                                        "label": "Organizers"
                                    },
                                    {
                                        "id": "element-1662912478794",
                                        "type": "EventAttachments",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {
                                                "marginTop": 30
                                            },
                                            "icon": "fa-solid fa-file-download"
                                        },
                                        "label": "Attachments"
                                    },
                                    {
                                        "id": "element-1662912510696",
                                        "type": "ShareAndExport",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding",
                                                "shareSettings"
                                            ],
                                            "style": {
                                                "marginTop": 30
                                            },
                                            items: [
                                                {
                                                    id: 'facebook',
                                                    label: 'Facebook',
                                                    enabled: true
                                                },
                                                {
                                                    id: 'x',
                                                    label: 'X (formerly Twitter)',
                                                    enabled: true
                                                },
                                                {
                                                    id: 'whatsapp',
                                                    label: 'WhatsApp',
                                                    enabled: true
                                                },
                                                {
                                                    id: 'messenger',
                                                    label: 'Messenger',
                                                    enabled: true
                                                },
                                                {
                                                    id: 'viber',
                                                    label: 'Viber',
                                                    enabled: true
                                                },
                                                {
                                                    id: 'telegram',
                                                    label: 'Telegram',
                                                    enabled: true
                                                },
                                                {
                                                    id: 'copylink',
                                                    label: 'Copy Link',
                                                    enabled: true
                                                },
                                                {
                                                    id: 'googlecal',
                                                    label: 'Export to Google Calendar',
                                                    enabled: true
                                                }
                                            ],
                                            "icon": "fa-solid fa-share-nodes"
                                        },
                                        "label": "Share & Export"
                                    }
                                ],
                                "properties": {
                                    "dropzone": true,
                                    "accepts": 'COMMON_ELEMENTS',
                                    "settings": [
                                        "padding",
                                        "margin",
                                        "conditions"
                                    ],
                                    "style": {},
                                    "icon": "fa-solid fa-table-columns"
                                },
                                "label": "Column"
                            }
                        ],
                        "properties": {
                            "dropzone": true,
                            "accepts": [
                                "Column"
                            ],
                            "settings": [
                                "gridTemplateColumns",
                                "gap",
                                "margin",
                                "padding",
                                "conditions"
                            ],
                            "style": {
                                "gap": 10,
                                "gridTemplateColumns": "repeat( auto-fit, minmax(250px, 1fr) )",
                                "marginBottom": 0,
                                "paddingTop": 20,
                                "paddingLeft": 20,
                                "paddingBottom": 20,
                                "paddingRight": 20
                            },
                            "icon": "fa-regular fa-square-full"
                        },
                        "label": "Row section"
                    }
                ],
                "properties": {
                    "dropzone": true,
                    "accepts": [],
                    "settings": [
                        "contentTab",
                        "padding",
                        "margin"
                    ],
                    "style": {}
                },
                "label": _x('Introduction', 'Tab label', 'stec'),
                "icon": "fas fa-info"
            },
            {
                "id": "element-1662912301632",
                "type": "ContentTab",
                "children": [
                    {
                        "id": "element-1662912589583",
                        "type": "Row",
                        "children": [
                            {
                                "id": "element-1662912590111",
                                "type": "Column",
                                "children": [
                                    {
                                        "id": "element-1662912616063",
                                        "type": "EventLocationAddress",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "conditions": [
                                                "physical_location"
                                            ],
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {},
                                            "icon": "fa-solid fa-align-justify"
                                        },
                                        "label": "Address"
                                    },
                                    {
                                        "id": "element-1662912619877",
                                        "type": "EventLocationDirections",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "conditions": [
                                                "physical_location"
                                            ],
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {
                                                "marginTop": 20
                                            },
                                            "icon": "fa-solid fa-route"
                                        },
                                        "label": "Directions"
                                    },
                                    {
                                        "id": "element-1662912624768",
                                        "type": "EventLocationAbout",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "conditions": [
                                                "physical_location"
                                            ],
                                            "accepts": [],
                                            "settings": [
                                                "textAlign",
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {
                                                "textAlign": "left",
                                                "marginTop": 40
                                            },
                                            "icon": "fa-solid fa-info"
                                        },
                                        "label": "About"
                                    }
                                ],
                                "properties": {
                                    "dropzone": true,
                                    "accepts": 'COMMON_ELEMENTS',
                                    "settings": [
                                        "padding",
                                        "margin",
                                        "conditions"
                                    ],
                                    "style": {},
                                    "icon": "fa-solid fa-table-columns"
                                },
                                "label": "Column"
                            },
                            {
                                "id": "element-1662912590713",
                                "type": "Column",
                                "children": [
                                    {
                                        "id": "element-1662912611057",
                                        "type": "EventLocationMap",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "conditions": [
                                                "physical_location"
                                            ],
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {},
                                            "icon": "fa-solid fa-map"
                                        },
                                        "label": "Map"
                                    }
                                ],
                                "properties": {
                                    "dropzone": true,
                                    "accepts": 'COMMON_ELEMENTS',
                                    "settings": [
                                        "padding",
                                        "margin",
                                        "conditions"
                                    ],
                                    "style": {},
                                    "icon": "fa-solid fa-table-columns"
                                },
                                "label": "Column"
                            }
                        ],
                        "properties": {
                            "dropzone": true,
                            "accepts": [
                                "Column"
                            ],
                            "settings": [
                                "gridTemplateColumns",
                                "gap",
                                "margin",
                                "padding",
                                "conditions"
                            ],
                            "style": {
                                "gap": 20,
                                "gridTemplateColumns": "repeat(auto-fit, minmax(250px, 1fr))",
                                "marginBottom": 20,
                                "paddingTop": 20,
                                "paddingLeft": 20,
                                "paddingBottom": 20,
                                "paddingRight": 20
                            },
                            "icon": "fa-regular fa-square-full",
                            "conditions": [
                                "physical_location"
                            ]
                        },
                        "label": "Row section"
                    },
                    {
                        "id": "element-1662912662086",
                        "type": "Row",
                        "children": [
                            {
                                "id": "element-1662912664020",
                                "type": "Column",
                                "children": [
                                    {
                                        "id": "element-1662912671375",
                                        "type": "EventVirtualLocation",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "conditions": [
                                                "virtual_location"
                                            ],
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {},
                                            "icon": "fa-solid fa-wifi"
                                        },
                                        "label": "Virtual location"
                                    }
                                ],
                                "properties": {
                                    "dropzone": true,
                                    "accepts": 'COMMON_ELEMENTS',
                                    "settings": [
                                        "padding",
                                        "margin",
                                        "conditions"
                                    ],
                                    "style": {},
                                    "icon": "fa-solid fa-table-columns"
                                },
                                "label": "Column"
                            }
                        ],
                        "properties": {
                            "dropzone": true,
                            "accepts": [
                                "Column"
                            ],
                            "settings": [
                                "gridTemplateColumns",
                                "gap",
                                "margin",
                                "padding",
                                "conditions"
                            ],
                            "style": {
                                "gap": 10,
                                "gridTemplateColumns": "repeat( auto-fit, minmax(250px, 1fr) )",
                                "marginBottom": 20,
                                "paddingTop": 20,
                                "paddingLeft": 20,
                                "paddingBottom": 20,
                                "paddingRight": 20
                            },
                            "icon": "fa-regular fa-square-full",
                            "conditions": [
                                "virtual_location"
                            ]
                        },
                        "label": "Row section"
                    }
                ],
                "properties": {
                    "dropzone": true,
                    "accepts": [],
                    "settings": [
                        "contentTab",
                        "padding",
                        "margin"
                    ],
                    "style": {}
                },
                "label": _x('Location', 'Tab label', 'stec'),
                "icon": "fas fa-map-marker"
            },
            {
                "id": "element-1662912314635",
                "type": "ContentTab",
                "children": [
                    {
                        "id": "element-1662912717025",
                        "type": "Row",
                        "children": [
                            {
                                "id": "element-1662912720404",
                                "type": "Column",
                                "children": [
                                    {
                                        "id": "element-1662912724180",
                                        "type": "EventSchedule",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {},
                                            "icon": "fa-solid fa-list"
                                        },
                                        "label": "Schedule"
                                    }
                                ],
                                "properties": {
                                    "dropzone": true,
                                    "accepts": 'COMMON_ELEMENTS',
                                    "settings": [
                                        "padding",
                                        "margin",
                                        "conditions"
                                    ],
                                    "style": {},
                                    "icon": "fa-solid fa-table-columns"
                                },
                                "label": "Column"
                            }
                        ],
                        "properties": {
                            "dropzone": true,
                            "accepts": [
                                "Column"
                            ],
                            "settings": [
                                "gridTemplateColumns",
                                "gap",
                                "margin",
                                "padding",
                                "conditions"
                            ],
                            "style": {
                                "gap": 10,
                                "gridTemplateColumns": "repeat( auto-fit, minmax(250px, 1fr) )",
                                "marginBottom": 20,
                                "paddingTop": 20,
                                "paddingLeft": 20,
                                "paddingBottom": 20,
                                "paddingRight": 20
                            },
                            "icon": "fa-regular fa-square-full",
                            "conditions": [
                                "schedule"
                            ]
                        },
                        "label": "Row section"
                    }
                ],
                "properties": {
                    "dropzone": true,
                    "accepts": [],
                    "settings": [
                        "contentTab",
                        "padding",
                        "margin"
                    ],
                    "style": {}
                },
                "label": _x('Schedule', 'Tab label', 'stec'),
                "icon": "fas fa-list"
            },
            {
                "id": "element-lfjpwwaf9ng1xtb9",
                "type": "ContentTab",
                "children": [
                    {
                        "id": "element-lfjpxao7owmmw37v",
                        "type": "Row",
                        "children": [
                            {
                                "id": "element-lfjpxxnz1011tgqd",
                                "type": "Column",
                                "children": [
                                    {
                                        "id": "element-lfjpxobbg45rcb3w",
                                        "type": "EventGuests",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {},
                                            "icon": "fa-solid fa-star"
                                        },
                                        "label": "Guests"
                                    }
                                ],
                                "properties": {
                                    "dropzone": true,
                                    "accepts": 'COMMON_ELEMENTS',
                                    "settings": [
                                        "padding",
                                        "margin",
                                        "conditions"
                                    ],
                                    "style": {},
                                    "icon": "fa-solid fa-table-columns"
                                },
                                "label": "Column"
                            }
                        ],
                        "properties": {
                            "dropzone": true,
                            "accepts": [
                                "Column"
                            ],
                            "settings": [
                                "gridTemplateColumns",
                                "gap",
                                "margin",
                                "padding",
                                "conditions"
                            ],
                            "style": {
                                "gap": 10,
                                "gridTemplateColumns": "repeat( auto-fit, minmax(250px, 1fr) )",
                                "marginBottom": 20,
                                "paddingTop": 20,
                                "paddingLeft": 20,
                                "paddingBottom": 20,
                                "paddingRight": 20
                            },
                            "icon": "fa-regular fa-square-full",
                            "conditions": [
                                "guests"
                            ]
                        },
                        "label": "Row section"
                    }
                ],
                "properties": {
                    "dropzone": true,
                    "accepts": [],
                    "settings": [
                        "contentTab",
                        "padding",
                        "margin"
                    ],
                    "style": {}
                },
                "label": _x('Guests', 'Tab label', 'stec'),
                "icon": "fas fa-star"
            },
            {
                "id": "element-1662912371517",
                "type": "ContentTab",
                "children": [
                    {
                        "id": "element-1662912845322",
                        "type": "Row",
                        "children": [
                            {
                                "id": "element-1662912845780",
                                "type": "Column",
                                "children": [
                                    {
                                        "id": "element-1662912848975",
                                        "type": "Comments",
                                        "children": [],
                                        "properties": {
                                            "dropzone": false,
                                            "accepts": [],
                                            "settings": [
                                                "margin",
                                                "padding"
                                            ],
                                            "style": {},
                                            "icon": "fa-solid fa-comments"
                                        },
                                        "label": "Comments"
                                    }
                                ],
                                "properties": {
                                    "dropzone": true,
                                    "accepts": 'COMMON_ELEMENTS',
                                    "settings": [
                                        "padding",
                                        "margin",
                                        "conditions"
                                    ],
                                    "style": {},
                                    "icon": "fa-solid fa-table-columns"
                                },
                                "label": "Column"
                            }
                        ],
                        "properties": {
                            "dropzone": true,
                            "accepts": [
                                "Column"
                            ],
                            "settings": [
                                "gridTemplateColumns",
                                "gap",
                                "margin",
                                "padding",
                                "conditions"
                            ],
                            "style": {
                                "gap": 10,
                                "gridTemplateColumns": "repeat( auto-fit, minmax(250px, 1fr) )",
                                "marginBottom": 20,
                                "paddingTop": 20,
                                "paddingLeft": 20,
                                "paddingBottom": 20,
                                "paddingRight": 20
                            },
                            "icon": "fa-regular fa-square-full",
                            "conditions": [
                                "comments"
                            ]
                        },
                        "label": "Row section"
                    }
                ],
                "properties": {
                    "dropzone": true,
                    "accepts": [],
                    "settings": [
                        "contentTab",
                        "padding",
                        "margin"
                    ],
                    "style": {}
                },
                "label": _x('Comments', 'Tab label', 'stec'),
                "icon": "fas fa-comments"
            }
        ],
        "properties": {
            "dropzone": false,
            "accepts": [],
            "settings": [
                "contentTabs",
                "padding",
                "margin"
            ],
            "style": {},
            "icon": "fa-solid fa-lines-leaning"
        },
        "label": "Content Tabs"
    }
];