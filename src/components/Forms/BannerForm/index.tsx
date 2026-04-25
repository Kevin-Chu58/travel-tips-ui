import {
  Box,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import FormBase from "../FormBases/FormBase";
import React, { useEffect, useState } from "react";
import DescriptionTextField from "@components/TextField/DescriptionTextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import { type Image } from "@services/images";
import ImageSelector from "@components/ImageSelector";
import BannerCard from "@components/Cards/BannerCard";
import {
  type BannerStyling,
  type Banner,
  type BannerStylingSimple,
  bannersService,
  type BannerStylingPatch,
} from "@services/feed/banners";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import TTButton from "@components/TTButton";
import { enqueueSnackbar } from "notistack";
import TimeUtils from "@utils/TimeUtils";
import { ImageType } from "@constants/Enums";
import dayjs from "dayjs";
import "./index.scss";

type BannerFormProps = {
  open: boolean;
  onClose: () => void;
  bannerId: number | undefined;
  asyncAddBanner?: (state: Banner) => void;
  asyncUpdateBanner?: (state: Banner) => void;
};

const BannerForm = ({
  open,
  onClose,
  bannerId,
  asyncAddBanner,
  asyncUpdateBanner,
}: BannerFormProps) => {
  // form inputs
  const [title, setTitle] = useState<string>("");
  const [overview, setOverview] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [label, setLabel] = useState<string>();
  const [subLabel, setSubLabel] = useState<string>();
  // form dates
  const [publishFrom, setPublishFrom] = useState<Dayjs | null>(null);
  const [publishTo, setPublishTo] = useState<Dayjs | null>(null);
  // form images
  const [image, setImage] = useState<Image | undefined>();
  // form banner styling
  const [stylings, setStylings] = useState<BannerStylingSimple[]>([]);
  const [styling, setStyling] = useState<BannerStyling | undefined>();
  // form status
  const [showStylingOption, setShowStylingOption] = useState<boolean>(false);
  const [styleMode, setStyleMode] = useState<"add" | "edit" | undefined>();
  // form styling template
  const [stylingName, setStylingName] = useState<string>("");
  const [stylingStr, setStylingStr] = useState<string>("");
  // banner - updating
  const [banner, setBanner] = useState<Banner | undefined>();

  const isInvalid =
    !title || !overview || publishFrom === null || !image || !styling;

  const bannerDraft = {
    id: bannerId,
    title: title,
    overview: overview,
    label: label,
    subLabel: subLabel,
    picture: image,
    from: TimeUtils.dayjsToString("YYYY-MM-DD", publishFrom),
    to: publishTo
      ? TimeUtils.dayjsToString("YYYY-MM-DD", publishTo)
      : undefined,
    styling:
      styleMode === "add"
        ? {
            styling: stylingStr,
          }
        : styling,
  } as Banner;

  // use effects

  // init banner on open
  useEffect(() => {
    if (open) {
      initBanner();
    }
  }, [open]);

  // init stylings when modifying styling templates
  useEffect(() => {
    const initStylings = async () => {
      if (showStylingOption && stylings.length === 0) {
        let stylings = await bannersService.getBannerStylings();
        setStylings(stylings);
      }
    };

    initStylings();
  }, [showStylingOption]);

  // rerender styling contents on styling
  useEffect(() => {
    setStylingName(styling?.name ?? "");
    setStylingStr(styling?.styling ?? "");
  }, [styling]);

  const initBanner = async () => {
    if (bannerId) {
      const banner = await bannersService.getBannerById(bannerId);
      setBanner(banner);

      setTitle(banner.title);
      setOverview(banner.overview);
      setLink(banner.link);
      setLabel(banner.label);
      setSubLabel(banner.subLabel);
      setPublishFrom(dayjs(banner.from));
      setPublishTo(banner.to ? dayjs(banner.to) : null);
      setImage(banner.picture);
      setStyling(banner.styling);

      setStyleMode("edit");
    }
  };

  // async functions

  const asyncImage = (_image: Image) => {
    if (image?.id !== _image.id) {
      setImage({ ..._image });
    }
  };

  const asyncAddStylings = (styling: BannerStyling) => {
    setStylings((prev) => [...prev, styling]);
  };

  const asyncUpdateStylings = (styling: BannerStyling) => {
    let _stylings = [...stylings];
    let stylingId = _stylings.findIndex((s) => s.id === styling.id);
    _stylings[stylingId!] = styling;

    setStylings(_stylings);
  };

  // handle functions

  const handleClose = () => {
    onClose();
    setTitle("");
    setOverview("");
    setLink("");
    setLabel("");
    setSubLabel("");
    setPublishFrom(null);
    setPublishTo(null);
    setImage(undefined);
    setStyling(undefined);
    setStyleMode(undefined);
    setShowStylingOption(false);
  };

  const handleCreate = async () => {
    if (isInvalid) return;

    try {
      const _banner = await bannersService.postBanner({
        title: title,
        overview: overview,
        link: link,
        label: label,
        subLabel: subLabel,
        from: TimeUtils.dayjsToString("YYYY-MM-DD", publishFrom),
        to: publishTo
          ? TimeUtils.dayjsToString("YYYY-MM-DD", publishTo)
          : undefined,
        imageId: image!.id,
        stylingId: styling!.id,
      });

      if (asyncAddBanner) asyncAddBanner(_banner);

      enqueueSnackbar("Banner created.", { variant: "success" });
      handleClose();
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const handleUpdate = async () => {
    if (!bannerId || !banner || isInvalid) return;

    try {
      let _from = TimeUtils.dayjsToString("YYYY-MM-DD", publishFrom);
      let _to =
        publishTo !== null
          ? TimeUtils.dayjsToString("YYYY-MM-DD", publishTo)
          : undefined;

      await bannersService.updateBanner(bannerId, {
        title: banner.title !== title ? title : undefined,
        overview: banner.overview !== overview ? overview : undefined,
        link: banner.link !== link ? link : undefined,
        label: banner.label !== label ? label : undefined,
        subLabel: banner.subLabel !== subLabel ? subLabel : undefined,
        from: banner.from !== _from ? _from : undefined,
        to: banner.to !== _to ? _to : undefined,
        imageId: banner.picture?.id !== image?.id ? image?.id : undefined,
        stylingId: banner.styling?.id !== styling?.id ? styling?.id : undefined,
      });

      if (asyncUpdateBanner) asyncUpdateBanner(bannerDraft);

      enqueueSnackbar("Banner updateed.", { variant: "success" });
      handleClose();
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const handleNewStylingClick = () => {
    setStyleMode("add");
  };

  const handleQuitAddMode = () => {
    if (styling) {
      setStyleMode("edit");
    } else {
      setStyleMode(undefined);
    }
  };

  const handleStylingChange = async (event: SelectChangeEvent<string>) => {
    let value = Number(event.target.value);

    if (value > 0) {
      let selectedStyling = await bannersService.getBannerStylingById(value);

      setStyling(selectedStyling);
      setStyleMode("edit");
    } else {
      setStyling(undefined);
      setStyleMode(undefined);
    }
  };

  const handleAddTemplate = async () => {
    if (!stylingName || !stylingStr) return;

    try {
      const styling = await bannersService.createBannerStyling(
        stylingName,
        stylingStr,
      );

      asyncAddStylings(styling);
      setStyling(styling);
      setStyleMode("edit");
      enqueueSnackbar("Styling template created.", { variant: "success" });
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const handleUpdateTemplate = async () => {
    if (!styling || !stylingName || !stylingStr) return;

    try {
      let stylingPatch = {
        name: stylingName !== styling.name ? stylingName : undefined,
        styling: stylingStr !== styling.styling ? stylingStr : undefined,
      } as BannerStylingPatch;

      let _styling = await bannersService.updateBannerStyling(
        styling.id,
        stylingPatch,
      );

      setStyling(_styling);
      asyncUpdateStylings(_styling);
      enqueueSnackbar("Styling template updated.", { variant: "success" });
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  return (
    <FormBase
      open={open}
      onClose={handleClose}
      className="banner-form"
      width="90vw"
      height="92vh"
      maxHeight="92vh"
      title={bannerId ? "Update Banner" : "New Banner"}
      actionButtonLabel={bannerId ? "Update" : "Create"}
      actionButtonOnClick={bannerId ? handleUpdate : handleCreate}
      panel
    >
      <Box className="row start form-content">
        {/* options */}
        <Box className="column option-box">
          {!showStylingOption ? (
            <React.Fragment>
              {/* open styling options button */}
              <Box>
                <Typography className="caption">Styling Template</Typography>
                {styling ? <Typography>{styling.name}</Typography> : undefined}
                <TTButton
                  color="utility"
                  startIcon={<SettingsIcon />}
                  onClick={() => setShowStylingOption(true)}
                >
                  Modify Styling
                </TTButton>
              </Box>

              {/* title */}
              <Box>
                <Typography className="caption">title*</Typography>
                <TextField
                  value={title}
                  label="Title"
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                />
              </Box>

              {/* link */}
              <Box>
                <Typography className="caption">link*</Typography>
                <TextField
                  value={link}
                  label="Link"
                  onChange={(e) => setLink(e.target.value)}
                  fullWidth
                />
              </Box>

              {/* publish from */}
              <Box>
                <Typography className="caption">Publish From*</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={publishFrom}
                    onChange={(e) => setPublishFrom(e)}
                  />
                </LocalizationProvider>
              </Box>

              {/* publish to */}
              <Box>
                <Typography className="caption">Publish Until</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={publishTo}
                    onChange={(e) => setPublishTo(e)}
                  />
                </LocalizationProvider>
              </Box>

              {/* background image */}
              <Box>
                <Typography className="caption">banner image*</Typography>
                {image ? (
                  <Box className="column">
                    <img
                      className="banner-image"
                      src={image.url}
                      alt={image.guid}
                      loading="lazy"
                    />
                    <Typography variant="body2">{image.name}</Typography>
                  </Box>
                ) : undefined}
                <ImageSelector
                  imageIds={image ? [image?.id] : []}
                  setImage={asyncImage}
                  imageType={ImageType.Banner}
                >
                  <Typography>
                    {image ? "Change Image" : "Choose Image"}
                  </Typography>
                </ImageSelector>
              </Box>

              {/* label */}
              <Box>
                <Typography className="caption">label</Typography>
                <TextField
                  value={label ?? ""}
                  label="Label"
                  onChange={(e) => setLabel(e.target.value)}
                  fullWidth
                />
              </Box>

              {/* sub-label */}
              <Box>
                <Typography className="caption">sub-label</Typography>
                <TextField
                  value={subLabel ?? ""}
                  label="Sub Label"
                  onChange={(e) => setSubLabel(e.target.value)}
                  fullWidth
                />
              </Box>

              {/* overview */}
              <Box>
                <Typography className="caption">overview*</Typography>
                <DescriptionTextField
                  value={overview}
                  setValue={setOverview}
                  placeholder="Write a few short sentences to attract readers."
                  maxHeight="400px"
                  maxLength={300}
                  isOfficial
                />
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* styling options */}
              <Box className="row">
                <SettingsIcon />
                <Typography variant="h6">Styling Option</Typography>
                <TTButton
                  className="styling-options-close-button"
                  color="utility"
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={() => setShowStylingOption(false)}
                >
                  Close
                </TTButton>
              </Box>

              {/* styling template selection & create new */}
              <Box className="row">
                <FormControl fullWidth>
                  <InputLabel id="select-country-label" size="small">
                    Style Template
                  </InputLabel>
                  <Select
                    id="select-country-input"
                    sx={{ width: "180px" }}
                    value={String(styling?.id ?? 0)}
                    label="Style Template"
                    size="small"
                    onChange={handleStylingChange}
                  >
                    <MenuItem value="0">
                      <em>None</em>
                    </MenuItem>
                    {stylings.map((styling) => (
                      <MenuItem key={styling.id} value={styling.id.toString()}>
                        {styling.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TTButton
                  color="utility"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleNewStylingClick}
                >
                  New
                </TTButton>
              </Box>

              {styleMode ? (
                <Box className="column gap">
                  <Divider variant="middle" flexItem>
                    <Chip
                      className="style-mode-chip"
                      label={
                        styleMode === "add" ? "New Template" : "Edit Template"
                      }
                      color="utility"
                      onDelete={
                        styleMode === "add" ? handleQuitAddMode : undefined
                      }
                    />
                  </Divider>

                  <Typography className="caption">name*</Typography>
                  <TextField
                    value={stylingName}
                    label="Template Name"
                    onChange={(e) => setStylingName(e.target.value)}
                    fullWidth
                  />

                  <Typography className="caption">styling*</Typography>
                  <TextField
                    value={stylingStr}
                    label="Styling"
                    onChange={(e) => setStylingStr(e.target.value)}
                    fullWidth
                    multiline
                  />

                  <TTButton
                    color="utility"
                    startIcon={<CheckIcon />}
                    onClick={
                      styleMode === "add"
                        ? handleAddTemplate
                        : handleUpdateTemplate
                    }
                  >
                    Save
                  </TTButton>
                </Box>
              ) : undefined}
            </React.Fragment>
          )}
        </Box>

        {/* preview - banner card */}
        <Box className="preview">
          <BannerCard banner={bannerDraft} allowNav={false} />
          <BannerCard banner={bannerDraft} mobileView allowNav={false} />
        </Box>
      </Box>
    </FormBase>
  );
};

export default BannerForm;
