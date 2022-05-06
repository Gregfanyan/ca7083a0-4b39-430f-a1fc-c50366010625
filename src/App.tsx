import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Cart from "./components/Cart";
import { useEvents } from "./contexts/ContextWrapper";
import EventList from "./components/EventList";
import useSearchFilteredEvents from "./hooks/useEventSearchAndSortFilter";
import Search from "./components/Search";
import { filter, groupBy, some } from "lodash";
const Wrapper = styled(Box)`
  margin: 40px;
`;

const StyledButton = styled(IconButton)`
  position: fixed;
  z-index: 100;
  right: 20px;
  top: 10px;
  width: "auto";
`;

export default function App() {
  const [cartOpen, setCartOpen] = React.useState(false);
  const {
    onChangeHadler,
    title,
    sortButtonHandleClick,
    cartItems,
    getTotalItems,
  } = useEvents();
  const [filteredEvents] = useSearchFilteredEvents(title);

  const filteredEventWithoutCart = filter(filteredEvents, (e) => {
    return !some(cartItems, (item) => e._id === item._id);
  });

  const grouppedEventsByDate = groupBy(filteredEventWithoutCart, "date");
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Search onChangeHadler={onChangeHadler} title={title} />
          <IconButton
            sx={{ zIndex: 100, marginRight: "30px" }}
            onClick={sortButtonHandleClick}
          >
            <FilterAltIcon sx={{ color: "#fff" }} />
          </IconButton>
          <Box sx={{ display: { xs: "flex" } }}>
            <StyledButton onClick={() => setCartOpen(true)}>
              <Badge badgeContent={getTotalItems()} color="error">
                <AddShoppingCartIcon sx={{ color: "#fff" }} />
              </Badge>
            </StyledButton>
          </Box>
        </Toolbar>
      </AppBar>
      <EventList
        grouppedEventsByDate={grouppedEventsByDate ? grouppedEventsByDate : {}}
      />
      <Wrapper>
        <Drawer
          anchor="right"
          open={cartOpen}
          onClose={() => setCartOpen(false)}
        >
          <Cart />
        </Drawer>
      </Wrapper>
    </Box>
  );
}
