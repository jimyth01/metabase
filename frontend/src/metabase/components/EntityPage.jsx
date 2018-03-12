import React, { Component } from "react";
import { Box, Flex } from "rebass";
import { Link } from "react-router";

import {
  PageSidebar,
  Wrapper
} from "./EntityLayout";

import EntityInfo from "./EntityInfo";

import Visualization from "metabase/visualizations/components/Visualization";
import QuestionHandler from 'metabase/hoc/QuestionHandler'

class EntityPage extends Component {
  render() {
    return (
      <QuestionHandler>
        { ({ question, result }) => {
          if(!question) {
            return (<div>Loading</div>)
          }

          const mode = question && question.mode();
          const actions = mode && mode.actions();
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
                        card: question.card(),
                        data: result.data
                      },
                    ]}
                  />
                )}
              </Box>
              <Box>
                <Wrapper>
                  <Flex>
                    <EntityInfo entity={question.card()} />
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
                  </Flex>
                </Wrapper>
              </Box>
            </div>
          )
        }}
      </QuestionHandler>
    );
  }
}

export default EntityPage;
