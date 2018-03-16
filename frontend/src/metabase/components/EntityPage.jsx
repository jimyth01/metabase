import React, { Component } from "react";
import { Box, Flex } from "rebass";
import { Link } from "react-router";

import {
  PageSidebar,
  Wrapper
} from "./EntityLayout";

import EntityInfo from "./EntityInfo";
import EntitySegments from './EntitySegments'

import Visualization from "metabase/visualizations/components/Visualization";
import QuestionLoader from 'metabase/containers/QuestionLoader'

class EntityPage extends Component {
  render() {
    return (
      <QuestionLoader questionId={this.props.params.cardId} questionHash={this.props.location.hash}>
        { (question) => {

          console.log('question', question)
          window.q = question

          if(!question) {
            return <div>"Loading..."</div>
          }

          const mode = question.mode && question.mode();
          const actions = mode && mode.actions();
          const card = question.card && question.card()

          let result

          return (
            <div key='entity'>
              <Box
                className="border-bottom"
                style={{ backgroundColor: "#FCFDFD", height: "65vh" }}
              >
                {result && (
                  <Visualization
                    className="full-height"
                    rawSeries={[
                      {
                        card,
                        data: result.data
                      },
                    ]}
                  />
                )}
              </Box>
              <Box>
                <Wrapper>
                  <Flex>
                    <EntityInfo entity={question} />
                    <PageSidebar>
                      <Box
                        p={2}
                        mt={4}
                        style={{ border: "1px solid #ddd", borderRadius: 6 }}
                      >
                        <Box>
                          <h3>Ways to view this</h3>
                          <ol>
                            {actions && actions.map(action => (
                              <li className="bordered rounded bg-white p1 inline-block">
                                { action.question &&  (
                                  <Link to={action.question().getUrl()}>
                                    {action.title}
                                  </Link>
                                )}
                              </li>
                            ))}
                          </ol>
                        </Box>
                        <EntitySegments question={question} />
                      </Box>
                    </PageSidebar>
                  </Flex>
                </Wrapper>
              </Box>
            </div>
          )
        }}
      </QuestionLoader>
    );
  }
}

export default EntityPage;
