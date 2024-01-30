import { StecSpan } from '@Stec/WebComponents';
import { __ } from '@wordpress/i18n';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {

            if (this.props.errorComponent) {
                return this.props.errorComponent;
            }

            const classNameArray = ['stec-fatal-error'];

            if (this.props.className) {
                classNameArray.push(this.props.className);
            }

            return (
                <StecSpan className={classNameArray.join(' ')}>

                    {this.props.icon && <i className={this.props.icon} />}

                    {
                        this.props.text ? this.props.text : __('Sorry, something went wrong', 'stec')
                    }
                </StecSpan>
            )
        }
        return this.props.children;
    }
}

export default ErrorBoundary;