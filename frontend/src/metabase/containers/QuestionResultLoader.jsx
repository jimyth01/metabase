import React from "react";
import { defer } from "metabase/lib/promise";

/*
 * Question result loader
 *
 * Handle runninng, canceling, and reloading Question results
 *
 * @example
 * <QuestionResultLoader question={question}>
 * { (result) =>
 *     <Visualization ... />
 * }
 * </QuestionResultLoader>
 *
 */
export class QuestionResultLoader extends React.Component {
  state = {
    result: null,
    cancel: null,
  };

  componentWillMount() {
    this._loadResult(this.props.question);
  }

  /*
   * load the result by calling question.apiGetResults
   */
  async _loadResult(question) {
    // we need to have a question for anything to happen
    if (question) {
      // set up a defer for cancelation
      let cancelDeferred = defer();

      // begin the request, set cancel in state so the query can be canceled
      this.setState({ cancel: cancelDeferred, result: null });

      // call apiGetResults and pass our cancel to allow for cancelation
      const result = await question.apiGetResults({ cancelDeferred });

      // setState with our result, remove our cancel
      this.setState({ cancel: null, result });
    } else {
      // if there's not a question we can't do anything so go back to our initial
      // state
      this.setState({ cancel: null, result: null });
    }
  }
  _reload() {
    this._loadResult(this.props.question);
  }

  /*
   *
   */
  _cancel() {
    if (this.state.cancel) {
      // call our cancel to cancel the query
      this.state.cancel();
      // cancel our cancel...
      this.setState({ cancel: null });
    }
  }

  render() {
    const { result } = this.state;
    return this.props.children({
      cancel: this._cancel,
      reload: this._reload,
      result,
    });
  }
}

export default QuestionResultLoader;
