function Highlight(props) {

    // Highlight component is removed for lite version
    // This component is here to preserve the code structure

    return (
        <pre className='stec-highlight'>
            <code className={`language-${props.lang}`}>
                {props.children}
            </code>
        </pre>
    )
}

export default Highlight