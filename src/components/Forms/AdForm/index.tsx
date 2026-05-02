import AdCard from "@components/Cards/AdCard";
import DemoFormBase from "../FormBases/DemoFormBase";
import type { Business } from "@services/feed/businesses";
import { adsService, type Ad, type AdPatch } from "@services/feed/ads";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TTButton from "@components/TTButton";
import { ImageType } from "@constants/Enums";
import { FiUpload, FiX } from "react-icons/fi";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@hooks/useIsMobile";
import React from "react";
import clsx from "clsx";
import "./index.scss";

// lazy load
const ImageSelector = React.lazy(() => import("@components/ImageSelector"));

type AdFormProps = {
  open: boolean;
  onClose: () => void;
  asyncAd: (state: Ad) => void;
  ad: Ad | undefined;
  business: Business | undefined;
};

const AdForm = ({ open, onClose, asyncAd, ad, business }: AdFormProps) => {
  // window
  const isMobile = useIsMobile();
  // form text inputs
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [linkLabel, setLinkLabel] = useState<string>("");
  const [link, setLink] = useState<string>("");
  // form option inputs
  const [templateId, setTemplateId] = useState<number>(0);
  // form image url & blob
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob>();
  // form input disable conditions
  const textDisable = [2];
  const linkLabelDisable = [1];
  // constants
  const templateCount = 2;
  // others
  const disableActionTemplate1 =
    !title || !text || !templateId || !localImageUrl;
  const disableActionTemplate2 =
    !title || !linkLabel || !templateId || !localImageUrl;

  const isActionDisabled = () => {
    switch (templateId) {
      case 1:
        return disableActionTemplate1;
      case 2:
        return disableActionTemplate2;
      default:
        return true;
    }
  };

  const adDraft = {
    title: title,
    text: text,
    linkLabel: linkLabel,
    link: link,
    templateId: templateId,
    picture: localImageUrl,
  } as Ad;

  // init inputs on open
  useEffect(() => {
    if (open) {
      setTitle(ad?.title ?? "Title here");
      setText(ad?.text ?? "Something you want to say.");
      setLinkLabel(ad?.linkLabel ?? "Label");
      setLink(ad?.link ?? "");
      setTemplateId(ad?.templateId ?? 1);
      setLocalImageUrl(ad?.picture ?? null);
    }
  }, [open]);

  // handle functions

  const handleFinishedCrop = (blob: Blob, dataUrl: string) => {
    // You now have the blob for future use
    setImageBlob(blob);

    // Use the dataUrl to show the image in your UI immediately
    setLocalImageUrl(dataUrl);
  };

  const handleSave = async () => {
    if (!business) return;

    try {
      // post new ad
      if (!ad) {
        adDraft.imageFile = imageBlob ?? new Blob();
        let _ad = await adsService.postNewAd(business.id, adDraft);
        asyncAd(_ad);
      }
      // update existing ad
      else {
        let adPatch = {
          title: adDraft.title !== ad.title ? adDraft.title : undefined,
          text: adDraft.text !== ad.text ? adDraft.text : undefined,
          linkLabel:
            adDraft.linkLabel !== ad.linkLabel ? adDraft.linkLabel : undefined,
          link: adDraft.link !== ad.link ? adDraft.link : undefined,
          templateId:
            adDraft.templateId !== ad.templateId
              ? adDraft.templateId
              : undefined,
          imageFile: imageBlob,
        } as AdPatch;

        let _ad = await adsService.updateAd(ad.id, adPatch);
        asyncAd({ ..._ad, status: "pending" });
      }

      enqueueSnackbar("Ad is now waiting to be reviewed.", {
        variant: "success",
      });
    } catch (e) {
      if (e instanceof Error) enqueueSnackbar(e.message, { variant: "error" });
    }

    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setText("");
    setLinkLabel("");
    setLink("");
    setTemplateId(1);
    setLocalImageUrl(null);
    setImageBlob(undefined);
    onClose();
  };

  return (
    <DemoFormBase
      className="ad-form"
      open={open}
      onClose={handleClose}
      width="40vw"
      maxHeight="80vh"
      demoChildren={<AdCard ad={adDraft} business={business} />}
      actionButton={
        <TTButton
          className="business-dashboard-button"
          onClick={handleSave}
          color="info"
          disabled={isActionDisabled()}
          disableRipple
        >
          Save
        </TTButton>
      }
    >
      <Box className="column gap">
        <Grid container columns={6} spacing={2}>
          {/* select template id */}
          <Box className="column start">
            <Typography variant="caption">Select Template*</Typography>
            <Box className="row gap template-container">
              {[...Array(templateCount)].map((_, i) => (
                <Box
                  key={i + 1}
                  className={clsx(
                    "template-box",
                    i + 1 === templateId && "focus",
                  )}
                  onClick={() => setTemplateId(i + 1)}
                >
                  <Typography variant="h5">
                    <b>{i + 1}</b>
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          {/* title & text */}
          <TextField
            label="Title*"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            slotProps={{
              input: {
                endAdornment: `${title.length}/50`,
              },
            }}
            color="info"
            size="small"
            fullWidth
          />
          <TextField
            label="Content"
            value={text}
            onChange={(e) => setText(e.target.value)}
            slotProps={{
              input: {
                endAdornment: `${text.length}/100`,
              },
            }}
            color="info"
            size="small"
            disabled={textDisable.includes(templateId)}
            fullWidth
            multiline
          />
          {/* link label & link */}
          <TextField
            label="Link Label"
            value={linkLabel}
            onChange={(e) => setLinkLabel(e.target.value)}
            slotProps={{
              input: {
                endAdornment: `${linkLabel.length}/50`,
              },
            }}
            color="info"
            size="small"
            disabled={linkLabelDisable.includes(templateId)}
            fullWidth
          />
          <TextField
            label="Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            slotProps={{
              input: {
                endAdornment: `${link.length}/255`,
              },
            }}
            color="info"
            size="small"
            fullWidth
            multiline
          />
          <Box className="column">
            <Typography variant="caption">Select Image*</Typography>
            <Box className={clsx(isMobile ? "column gap" : "row")}>
              <ImageSelector
                imageType={ImageType.Ad}
                onCrop={handleFinishedCrop}
              >
                <TTButton
                  className="business-dashboard-button"
                  color="utility"
                  startIcon={<FiUpload />}
                  stopPropagation={false}
                  disableRipple
                  fakeButton
                >
                  Upload
                </TTButton>
              </ImageSelector>
              {localImageUrl ? (
                <TTButton
                  className="business-dashboard-button"
                  startIcon={<FiX />}
                  color="utility"
                  variant="outlined"
                  onClick={() => setLocalImageUrl(null)}
                  disableRipple
                >
                  Remove
                </TTButton>
              ) : undefined}
            </Box>
          </Box>
        </Grid>
      </Box>
    </DemoFormBase>
  );
};

export default AdForm;
