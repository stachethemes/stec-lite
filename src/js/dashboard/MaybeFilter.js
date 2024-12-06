export const isKeywordFound = (searchValue, keywords) => {

    if (searchValue && searchValue.length > 0) {

        let found = false;

        for (let i = 0; i < keywords.length; i++) {
            if (keywords[i].toLowerCase().includes(searchValue.toLowerCase())) {
                found = true;
                break;
            }
        }

        if (!found) {
            return false;
        }

    }

    return true;

}

const MaybeFilter = (props) => {

    const itemKeywords = props.keywords;
    const searchValue = props.searchValue;

    if (searchValue && searchValue.length > 0) {

        const found = isKeywordFound(searchValue, itemKeywords);

        if (!found) {
            return null;
        } else {
            return props.children;
        }

    }

    return (
        props.children
    )
}

export default MaybeFilter