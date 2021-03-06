import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Router, Route, Redirect, Link } from 'react-router';

class CommentBox extends React.Component {
    constructor() {
        super(); // WTF IS THIS MATE
        this.state = {
            data: []
        };

        this._handleCommentSubmit = this._handleCommentSubmit.bind(this);
    }

    _loadCommentsFromServer() {
        $.ajax({
              url: this.props.url,
              dataType: 'json',
              cache: false,
              success: function(data) {
                this.setState({data: data});
              }.bind(this),
              error: function(xhr, status, err) {
                console.log('fail!');
                console.error(this.props.url, status, err.toString());
              }.bind(this)
        });
    }

    _handleCommentSubmit(comment) {

        // OPTIMISTIC UPDATE
        var comments = this.state.data;
        var newComment = comment;
        newComment._id = new Date().getTime() + Math.round(Math.random() * 100) + Math.round(Math.random() * 10)
        var newComments = comments.concat([newComment]);
        this.setState({data: newComments});

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
            console.log('ajax success:') //unsure why this does not fire
            this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
             this.setState({data: newComments});  // PART OF OPTIMISTIC UPDATE
            console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    }

    _thisIsMethod() {
        console.log('thisIsMethod called');
    }

    _initialize(init) {
        return init
    }

    componentDidMount() {
        socket.on('init', this._initialize(this._loadCommentsFromServer.bind(this)));
    }

    render() {
        return (
            <div className="commentBox">
                <h1> Composable Componenets </h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this._handleCommentSubmit} />
            </div>
        );
    }
}

class CommentList extends React.Component {

    _getComments() {
        var commentNodes = this.props.data;
        return commentNodes.map((comment) => {
            return (
                <Comment author={comment.author} key={comment._id}>
                    {comment.text};
                </Comment>
            )
        });
    }

    render() {
        var commentNodes = this._getComments();
        console.log(commentNodes);
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        )
    }
};

class Comment extends React.Component {
    render() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    author: {this.props.author}
                </h2>
                <p className="commentAuthor">
                    {this.props.children}
                </p>
            </div>
        )
    }
};

class CommentForm extends React.Component {

    constructor() {

        super();
        this.state = {
            author: 'test',
            text: 'test'
        };

        this._handleAuthorChange = this._handleAuthorChange.bind(this);
        this._handleTextChange = this._handleTextChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleAuthorChange(e) {
        this.setState({author: e.target.value});
    }

    _handleTextChange(e) {
        this.setState({text: e.target.value});
    }

    _handleSubmit(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if(!text || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, text: text});
        this.setState({author: '', text: ''});
    }

    componentDidMount() {
        console.log(this.state);
    }

    render() {
        return (
            <form className="commentForm" onSubmit={this._handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this._handleAuthorChange}
                />
                <input
                    type="text"
                    placeholder="Say something..."
                    value={this.state.text}
                    onChange={this._handleTextChange}
                />
                <input
                    type="submit"
                    value="submit"
                />
            </form>
        );
    }
};
