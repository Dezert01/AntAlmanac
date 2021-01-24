import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTable from './SectionTable';
import RightPaneStore from '../../stores/RightPaneStore';

class GeDataFetchProvider extends PureComponent {
    state = {
        courseDetails: this.props.courseDetails,
    };

    async componentDidMount() {
        const formData = RightPaneStore.getFormData();

        const params = {
            department: this.props.courseDetails.deptCode,
            term: formData.term,
            ge: 'ANY',
            courseNumber: this.props.courseDetails.courseNumber,
        };

        const response = await fetch('/api/websocapi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });

        const jsonResp = await response.json();

        this.setState({
            courseDetails: jsonResp.schools[0].departments[0].courses[0],
        });
    }

    render() {
        return <SectionTable {...this.props} courseDetails={this.state.courseDetails} />;
    }
}

GeDataFetchProvider.propTypes = {
    courseDetails: PropTypes.object.isRequired,
    term: PropTypes.string.isRequired,
    colorAndDelete: PropTypes.bool.isRequired,
};

export default GeDataFetchProvider;
