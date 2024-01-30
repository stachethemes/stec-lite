import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { MediaFrame } from '@Stec/JS/helpers.js';
import { StecDiv, StecSpan } from '@Stec/WebComponents';
import { useState } from 'react';
import Button from './Button';
import UploadImages from '@Stec/CommonComponents/UploadImages';
import FieldDescription from './FieldDescription';
import FieldTitle from './FieldTitle';
import { SortableItem } from './SortableItem';
import { cloneDeep } from 'lodash';

const CommonMediaImagesButton = ({
    buttonTitle,
    title,
    multiple,
    onSelectedImages
}) => {

    const [uploadImagesOpen, setUploadImagesOpen] = useState(false);

    const mediaLibraryMode = async () => {

        const images = await MediaFrame({
            title: title,
            buttonText: buttonTitle,
            libraryType: 'image',
            multiple: multiple
        });

        onSelectedImages(images);

    }

    const wpMediaIsDisabled = typeof window.wp.media === 'undefined' || !STEC_VARIABLES?.current_user?.capability?.upload_files;
    const anonImgUploadIsDisabled = !STEC_VARIABLES?.current_user?.capability?.upload_images;
    const buttonIsDisabled = wpMediaIsDisabled && anonImgUploadIsDisabled;

    return (
        <>

            <UploadImages 
                isOpen={uploadImagesOpen}
                multiple={multiple}
                onClose={() => setUploadImagesOpen(false)}
                onSelectedImages={onSelectedImages}
            />

            <Button
                disabled={buttonIsDisabled}
                className='blue'
                label={buttonTitle}
                onClick={async () => {

                    if (!wpMediaIsDisabled) {
                        await mediaLibraryMode();
                    } else if (!anonImgUploadIsDisabled) {
                        setUploadImagesOpen(true);
                    } else {
                        // do nothing
                    }

                }} />
        </>
    )

}

export const UncontrolledInputImages = (props) => {

    const [currentValue, setCurrentValue] = useState(props.defaultValue || []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10, // https://docs.dndkit.com/api-documentation/sensors
            },
        }),
    );

    const handleDragEnd = (event) => {

        const { active, over } = event;

        const sortImages = () => {

            let oldIndex, newIndex;

            currentValue.forEach((image, index) => {

                if (image.id === active.id) {
                    oldIndex = index;
                }

                if (image.id === over.id) {
                    newIndex = index;
                }
            });

            return arrayMove(currentValue, oldIndex, newIndex);
        };

        if (active.id !== over.id) {

            const newState = sortImages();

            setCurrentValue(newState)

            props.onChange(newState);
        }

    }

    const onRemove = (id) => {

        const cloneCurrent = cloneDeep(currentValue);

        const newState = cloneCurrent.filter(item => {
            return id !== item.id;
        });

        setCurrentValue(newState);

        if (props.onChange) {
            props.onChange(newState);
        }
    }

    const onSelectedImages = (images) => {

        let imagesData = [];

        const allowedDimensions = [
            'full',
            'large',
            'medium',
            'thumbnail'
        ];

        if (images && Array.isArray(images)) {

            images.forEach((image) => {

                // remove sizes not in allowedDimensions
                Object.keys(image.sizes).forEach((key) => {
                    if (!allowedDimensions.includes(key)) {
                        delete image.sizes[key];
                    }
                });

                // add missing sizes
                allowedDimensions.forEach((key) => {
                    if (!image.sizes[key]) {
                        image.sizes[key] = image.sizes.full;
                    }
                });

                const imgData = {

                    id: image.id,

                    sizes: Object.entries(image.sizes).reduce((acc, [key, value]) => {
                        acc[key] = value.url;
                        return acc;
                    }, {}),

                    dimensions: Object.entries(image.sizes).reduce((acc, [key, value]) => {
                        acc[key] = {
                            height: value.height,
                            width: value.width,
                            ar: value.width / value.height
                        };

                        return acc;

                    }, {})
                }

                imagesData.push(imgData);
            });
        }

        if (props.multiple) {
            imagesData = [...currentValue, ...imagesData];

            // remove duplicates by id
            imagesData = imagesData.filter((image, index, self) =>
                index === self.findIndex((t) => (
                    t.id === image.id
                ))
            );

        }

        setCurrentValue(imagesData);

        if (props.onChange) {
            props.onChange(imagesData);
        }
    }

    return (
        <StecDiv className='stec-input-images'>
            <FieldTitle text={props.title} />
            <StecDiv className='stec-input-images-list'>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={currentValue} strategy={horizontalListSortingStrategy}>
                        {Array.isArray(currentValue) && currentValue.map((image) => {
                            return <SortableItem key={image.id} id={image.id} >

                                <StecDiv key={image.id} className='stec-input-images-list-image'>

                                    <StecSpan onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(image.id)

                                    }}><i className='fa-solid fa-times' /></StecSpan>

                                    <img src={image.sizes.thumbnail} />

                                </StecDiv>

                            </SortableItem>
                        })}
                    </SortableContext>
                </DndContext>

            </StecDiv>

            <CommonMediaImagesButton
                buttonTitle={props.buttonTitle}
                title={props.title}
                multiple={props.multiple}
                onSelectedImages={onSelectedImages}
            />

            <FieldDescription text={props.description} />
        </StecDiv>
    )
}

export const InputImages = (props) => {

    const currentValue = props.value;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10, // https://docs.dndkit.com/api-documentation/sensors
            },
        }),
    );

    const handleDragEnd = (event) => {

        const { active, over } = event;

        const sortImages = () => {

            let oldIndex, newIndex;

            currentValue.forEach((image, index) => {

                if (image.id === active.id) {
                    oldIndex = index;
                }

                if (image.id === over.id) {
                    newIndex = index;
                }
            });

            return arrayMove(currentValue, oldIndex, newIndex);
        };

        if (active.id !== over.id) {

            const newState = sortImages();

            props.onChange(newState);
        }

    }

    const onRemove = (id) => {

        const cloneCurrent = cloneDeep(currentValue);

        const newState = cloneCurrent.filter(item => {
            return id !== item.id;
        });

        if (props.onChange) {
            props.onChange(newState);
        }
    }

    const onSelectedImages = (images) => {

        let imagesData = [];

        const allowedDimensions = [
            'full',
            'large',
            'medium',
            'thumbnail',
        ];

        if (images && Array.isArray(images)) {

            images.forEach(image => {

                // remove sizes not in allowedDimensions
                Object.keys(image.sizes).forEach((key) => {
                    if (!allowedDimensions.includes(key)) {
                        delete image.sizes[key];
                    }
                });

                // add missing sizes
                allowedDimensions.forEach((key) => {
                    if (!image.sizes[key]) {
                        image.sizes[key] = image.sizes.full;
                    }
                });

                const imgData = {

                    id: image.id,
                    sizes: Object.entries(image.sizes).reduce((acc, [key, value]) => {
                        acc[key] = value.url;
                        return acc;
                    }, {}),
                    dimensions: Object.entries(image.sizes).reduce((acc, [key, value]) => {
                        acc[key] = {
                            height: value.height,
                            width: value.width,
                            ar: value.width / value.height
                        };
                        return acc;
                    }, {})
                }

                imagesData.push(imgData);
            });
        }

        if (props.multiple) {
            imagesData = [...currentValue, ...imagesData];

            // remove duplicates by id
            imagesData = imagesData.filter((image, index, self) =>
                index === self.findIndex((t) => (
                    t.id === image.id
                ))
            );
        }

        if (props.onChange) {
            props.onChange(imagesData);
        }
    }

    return (
        <StecDiv className='stec-input-images'>
            <FieldTitle text={props.title} />

            <StecDiv className='stec-input-images-list'>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={currentValue} strategy={horizontalListSortingStrategy}>
                        {Array.isArray(currentValue) && currentValue.map((image) => {
                            return <SortableItem key={image.id} id={image.id} >

                                <StecDiv key={image.id} className='stec-input-images-list-image'>

                                    <StecSpan onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(image.id)

                                    }}><i className='fa-solid fa-times' /></StecSpan>

                                    <img src={image.sizes.thumbnail} alt={image.sizes.thumbnail} />

                                </StecDiv>

                            </SortableItem>
                        })}
                    </SortableContext>
                </DndContext>

            </StecDiv>

            <CommonMediaImagesButton
                buttonTitle={props.buttonTitle}
                title={props.title}
                multiple={props.multiple}
                onSelectedImages={onSelectedImages}
            />

            <FieldDescription text={props.description} />
        </StecDiv>
    )
}

export default InputImages
