import React, { Component } from "react";
import { Box, Flex } from "rebass";
import { connect } from "react-redux";

import { PageSidebar, Wrapper } from "./EntityLayout";

import EntityInfo from "./EntityInfo";

import { getMetadata } from "metabase/selectors/metadata";
import Question from "metabase-lib/lib/Question";

import { loadCard } from "metabase/lib/card";

import { loadMetadataForCard } from "metabase/query_builder/actions";

import { CardApi } from "metabase/services";
import Visualization from "metabase/visualizations/components/Visualization";

class EntityPage extends Component {
  state = {
    card: {},
    viz: undefined,
  };

  async componentDidMount() {
    const card = await loadCard(this.props.params.cardId);

    await loadMetadataForCard(card);

    const queryParams = {
      cardId: card.id,
      ignore_cache: false,
    };

    const viz = await CardApi.query(queryParams);

    this.setState({
      card,
      question: new Question(getMetadata(this.props.state), card),
      viz,
    });
  }

  render() {
    const { card, viz } = this.state;

    window.q = this.state.question;

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
                  card,
                  data: viz.data,
                },
              ]}
            />
          )}
        </Box>
        <Box>
          <Wrapper>
            <Flex>
              <EntityInfo entity={card} />
              <PageSidebar>
                <Box
                  p={2}
                  mt={4}
                  style={{ border: "1px solid #ddd", borderRadius: 6 }}
                >
                  <Box>
                    <h3>Ways to view this</h3>
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
    );
  }
}

export default connect(
  state => ({
    state,
  }),
  {
    loadMetadataForCard,
  },
)(EntityPage);
