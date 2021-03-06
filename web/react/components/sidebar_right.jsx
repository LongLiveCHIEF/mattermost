// Copyright (c) 2015 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import SearchResults from './search_results.jsx';
import RhsThread from './rhs_thread.jsx';
import SearchStore from '../stores/search_store.jsx';
import PostStore from '../stores/post_store.jsx';
import * as Utils from '../utils/utils.jsx';

export default class SidebarRight extends React.Component {
    constructor(props) {
        super(props);

        this.plScrolledToBottom = true;

        this.onSelectedChange = this.onSelectedChange.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onShowSearch = this.onShowSearch.bind(this);

        this.doStrangeThings = this.doStrangeThings.bind(this);

        this.state = this.getStateFromStores();
    }
    getStateFromStores() {
        return {
            search_visible: SearchStore.getSearchResults() != null,
            post_right_visible: PostStore.getSelectedPost() != null,
            is_mention_search: SearchStore.getIsMentionSearch()
        };
    }
    componentDidMount() {
        SearchStore.addSearchChangeListener(this.onSearchChange);
        PostStore.addSelectedPostChangeListener(this.onSelectedChange);
        SearchStore.addShowSearchListener(this.onShowSearch);
        this.doStrangeThings();
    }
    componentWillUnmount() {
        SearchStore.removeSearchChangeListener(this.onSearchChange);
        PostStore.removeSelectedPostChangeListener(this.onSelectedChange);
        SearchStore.removeShowSearchListener(this.onShowSearch);
    }
    componentWillUpdate() {
        PostStore.jumpPostsViewSidebarOpen();
    }
    doStrangeThings() {
        // We should have a better way to do this stuff
        // Hence the function name.
        $('.inner__wrap').removeClass('.move--right');
        $('.inner__wrap').addClass('move--left');
        $('.sidebar--left').removeClass('move--right');
        $('.sidebar--right').addClass('move--left');

        //$('.sidebar--right').prepend('<div class="sidebar__overlay"></div>');

        if (!(this.state.search_visible || this.state.post_right_visible)) {
            $('.inner__wrap').removeClass('move--left').removeClass('move--right');
            $('.sidebar--right').removeClass('move--left');
            return (
                <div></div>
            );
        }

        /*setTimeout(() => {
            $('.sidebar__overlay').fadeOut('200', () => {
                $('.sidebar__overlay').remove();
            });
            }, 500);*/
    }
    componentDidUpdate() {
        this.doStrangeThings();
    }
    onSelectedChange(fromSearch) {
        var newState = this.getStateFromStores(fromSearch);
        newState.from_search = fromSearch;
        if (!Utils.areObjectsEqual(newState, this.state)) {
            this.setState(newState);
        }
    }
    onSearchChange() {
        var newState = this.getStateFromStores();
        if (!Utils.areObjectsEqual(newState, this.state)) {
            this.setState(newState);
        }
    }
    onShowSearch() {
        if (!this.state.search_visible) {
            this.setState({
                search_visible: true
            });
        }
    }
    render() {
        var content = '';

        if (this.state.search_visible) {
            content = <SearchResults isMentionSearch={this.state.is_mention_search} />;
        } else if (this.state.post_right_visible) {
            content = (
                <RhsThread
                    fromSearch={this.state.from_search}
                    isMentionSearch={this.state.is_mention_search}
                />
            );
        }

        return (
            <div className='sidebar-right-container'>
                {content}
            </div>
        );
    }
}
