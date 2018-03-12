import React, { Component } from "react";
import { Box, Flex } from "rebass";
import { connect } from "react-redux";
import { Link } from "react-router";

import { PageSidebar, Wrapper } from "./EntityLayout";

import EntityInfo from "./EntityInfo";

import { fetchQuestion } from "metabase/questions/questions";

import { getQuestion } from "metabase/questions/selectors";

import { CardApi } from 'metabase/services'
import Visualization from "metabase/visualizations/components/Visualization";

const mapStateToProps = state => ({
  question: getQuestion(state),
});

class EntityPage extends Component {
  state = {
    viz: null,
  };
  async componentWillMount() {
    const { params } = this.props
    this.props.dispatch(fetchQuestion(params.cardId));

    const queryParams = {
      cardId: params.cardId,
      ignore_cache: false,
    };

    const viz = await CardApi.query(queryParams);

    this.setState({
      viz
    })
  }

  render() {
    const { question } = this.props;
    const { viz } = this.state;

    const mode = question && question.mode();
    const actions = mode && mode.actions();

    window.q = question;

    return (
      <div>
        <Box
          className="border-bottom"
          style={{ backgroundColor: "#FCFDFD", height: "65vh" }}
        >
          {viz && (
            <Visualization
              className="full-height"
              rawSeries={[
                {
                  card: question.card(),
                  data: viz.data,
                },
              ]}
            />
          )}
        </Box>
        <Box>
          <Wrapper>
            <Flex>
              {question && <EntityInfo entity={question.card()} />}
              {question && (
                <PageSidebar>
                  <Box
                    p={2}
                    mt={4}
                    style={{ border: "1px solid #ddd", borderRadius: 6 }}
                  >
                    <Box>
                      <h3>Ways to view this</h3>
                      <ol>
                        {actions.map(action => (
                          <li className="bordered rounded bg-white p1 inline-block">
                            <Link to={action.question().getUrl()}>
                              {action.title}
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </Box>
                    <Box>
                      <h3>Segments for this</h3>
                    </Box>
                  </Box>
                </PageSidebar>
              )}
            </Flex>
          </Wrapper>
        </Box>
      </div>
    );
  }
}

export default connect(mapStateToProps)(EntityPage);
