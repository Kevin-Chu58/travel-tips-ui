import { Box, Container, Grid, Typography } from "@mui/material";

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
            backgroundImage: `url("src/assets/alone.png")`,
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
                Enjoy
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
