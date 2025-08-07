import { Box, Container, Grid, Typography } from "@mui/material";
import alone from "@assets/alone.png";

const Main = () => {
  return (
    <Container maxWidth={false} disableGutters sx={{ m: 0, p: 0, mt: "-64px" }}>
      <Grid direction="column" container>
        <Grid
          size={12}
          height="100vh"
          display="flex"
          justifyContent="end"
          alignItems="center"
          sx={{
            backgroundImage: `url(${alone})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            filter: "brightness(1.3)",
          }}
        >
          <Box mt={-10} mr={10} textAlign="end">
            <Typography
                variant="h1"
                mb={2}
                fontFamily="lily script one"
                color="primary"
            >
                Enjoy Peace
            </Typography>
            <Typography
                variant="h3"
                color="white"
                fontFamily="lily script one"
            >
                before everyone
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Main;
