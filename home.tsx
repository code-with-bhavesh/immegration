import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../store/store";
import { getProgressData } from "../../store/thunk/documentThunk";
import { addUserForm } from "../../store/thunk/formThunk";
import {
  anonymousUser,
  checkDependant,
  structureArray,
} from "../../helper/service";
import { useNavigate } from "react-router";
import PayAndDownloadButton from "../payAndDownload/payAndDownloadButton";
import SignInSignUpButton from "../payAndDownload/signInSignUpButton";
import BackDropLoader from "../../components/loader/backDropLoader";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getSignleFormData, uiFormPayload } = useAppSelector(
    (state: any) => state?.formReducer
  );
  const { progressData } = useAppSelector(
    (state: any) => state?.documentReducer
  );

  const { loading } = useAppSelector((state: any) => state.notificationReducer);
  const { uiFormPayloadLoading } = useAppSelector(
    (state: any) => state?.notificationReducer
  );

  let localData: any = localStorage.getItem("bootstrapData");
  const bootstrapData: any = JSON.parse(localData);

  const [currentData, setCurrentData] = React.useState<any>({});
  const [allDatas, setAllDatas] = React.useState<any>({});
  const [sectionLists, setSectionLists] = React.useState<any>([]);
  const [uiNodeList, setUiNodeList] = React.useState([]);
  let [formData, setFormData] = useState<any>({});
  let [lastLoginData, setLastLoginData] = useState<any>({});
  const [locked, setLocked] = useState<any>(false);
  const [paymentLoader, setPaymentLoader] = useState<boolean>(false);
  const [showCardForm, setShowCardForm] = useState<any>(false);

  useEffect(() => {
    if (uiFormPayload?.ui_form_lock_state) {
      setLocked(uiFormPayload?.ui_form_lock_state);
    } else {
      setLocked(false);
    }
  }, [uiFormPayload]);

  useEffect(() => {
    let currentDataList: any = {};

    if (getSignleFormData?.flowJson) {
      const fetchData = async () => {
        if (getSignleFormData?.flowJson) {
          let uiJson = JSON.parse(getSignleFormData?.uiJson || "{}");
          setUiNodeList(uiJson);
        }

        const nodeData = JSON.parse(getSignleFormData?.flowJson);

        let getJsonData: any = await convertIntoUiJson(nodeData?.nodes);
        setAllDatas(getJsonData);
        let tempArr = structureArray(getJsonData);

        const sectionData = nodeData?.nodes?.filter(
          (obj: any) => obj?.data?.nodeType === "section"
        );

        setSectionLists(sectionData);
        // const mainProgress = progressData?.filter(
        //   (obj: any) =>
        //     obj?.percentComplete < 100 &&
        //     sectionData?.findIndex(
        //       (item: any) => item?.id === obj?.sectionKey
        //     ) >= 0
        // );
        // const findMainIndex = mainProgress?.map((ele: any) =>
        //   sectionData?.findIndex((obj: any) => obj?.id === ele?.sectionKey)
        // );
        // let lastLoginData: any = {};
        // let resumeIndex: any = 0;
        // if (findMainIndex && findMainIndex?.length > 0) {
        //   const indexes = findMainIndex;
        //   resumeIndex = Math.min(...indexes);
        //   lastLoginData = sectionData?.[resumeIndex];
        // } else {
        //   lastLoginData = sectionData?.[0];
        // }
        // setLastLoginData(lastLoginData);
        // // console.log("lastLoginData ", lastLoginData);

        // if (lastLoginData) {
        //   const mainSectionData = nodeData?.nodes?.filter(
        //     (obj: any) => obj?.parentNode === lastLoginData?.id
        //   );
        //   // console.log("mainSectionData ", mainSectionData);
        //   const summaryData = mainSectionData?.find(
        //     (summ: any) => summ?.data?.nodeTitle === "Summary"
        //   );
        //   console.log("summaryData", summaryData);

        //   // console.log("summaryData ", summaryData);
        //   // console.log("lastLoginData?.sectionKey ", lastLoginData?.sectionKey);

        //   if (summaryData) {
        //     // console.log("sectionData.findIndex ", sectionData.findIndex((ele: any) => ele?.id === lastLoginData?.id));
        //     currentDataList.currentSectionIndex = resumeIndex + 1;
        //     currentDataList.currentSectionId = lastLoginData?.id;
        //     currentDataList.currentGroupSummaryId = summaryData?.id;
        //     currentDataList.currentQuestionGroupId = lastLoginData?.id;
        //     setCurrentData(currentDataList);
        //   }
        // }
      };
      fetchData();
    }
  }, [getSignleFormData]);

  useEffect(() => {
    dispatch(getProgressData());
  }, []);

  useEffect(() => {
    const isEligibilityFilled = progressData?.find(
      (section: any) => section?.sectionKey === "General_Eligibility"
    );
    if (isEligibilityFilled && isEligibilityFilled?.percentComplete === 0) {
      navigate("/eligibility-check/Eligibility%20Quiz");
    }
  }, [progressData]);

  useEffect(() => {
    // if (uiFormPayload !== null) {
      setFormData({ ...uiFormPayload });
    // }
  }, [uiFormPayload]);

  const convertIntoUiJson = (jsonData: any) => {
    try {
      let orderCounts: any = [];
      return (
        !!jsonData &&
        jsonData.length > 0 &&
        jsonData.map((val: any) => {
          let childList = jsonData
            .filter((row: any) => val.id === row.parentNode)
            .map((row: any) => row.id);
          let order = orderCounts.filter((row: any) => val.parentNode === row);
          orderCounts.push(val.parentNode);

          return {
            id: val.id,
            nodeTitle: val.data?.nodeTitle,
            parentNode: val?.parentNode,
            order: (!!order?.length ? order?.length : 0) + 1,
            children: childList,
            data: val?.data,
          };
        })
      );
    } catch (error) {
      alert("json is not correct.");
    }
  };

  const onStart = () => {
    const section = sectionLists.filter(
      (val: any) => val?.id == "General_Eligibility"
    );
    navigate(`/eligibility-check/${encodeURI(section[0]?.data?.nodeTitle)}`);
  };

  const onResumeClick = () => {
    const sectionListsMainData: any = uiNodeList?.filter((val: any) =>
      checkDependant(val, formData)
    );

    const eligibilityProgress = progressData.filter(
      (val: any) =>
        val.sectionKey == "General_Eligibility" && val.percentComplete >= 88
    );

    if (eligibilityProgress.length > 0) {
      const sectionPercentag = sectionLists
        .filter((val: any) => val?.id !== "General_Eligibility")
        .map((section: any) => {
          const matchingItem2 = progressData.find(
            (progress: any) => progress.sectionKey === section.id
          );
          return {
            ...section,
            percentComplete: matchingItem2?.percentComplete || 0,
            missingFlowIds: matchingItem2?.missingFlowIds || [],
            filledFlowIds: matchingItem2?.filledFlowIds || [],
          };
        });

      const filteredSection = sectionPercentag.filter(
        (val: any) => val?.percentComplete < 100
      );

      const activeSectionId = filteredSection[0].id;
      const activeSectionIndex = sectionLists?.findIndex(
        (val: any) => val?.id == filteredSection[0].id
      );

      const activeSectionSummary = allDatas?.filter(
        (obj: any) => obj?.parentNode === activeSectionId
      );

      const activeSummaryIndex = activeSectionSummary.findIndex(
        (val: any) => val?.data?.nodeTitle == "Summary"
      );

      if (filteredSection[0]?.id !== "General_Eligibility") {
        navigate(`/eligibility-check/${filteredSection[0]?.data?.nodeTitle}`);
      } else {
        navigate(
          `/eligibility-check/${filteredSection[0]?.data?.nodeTitle}?summary=${activeSectionSummary[activeSummaryIndex]?.id}`
        );
      }
      // navigate(
      //   `/eligibility-check/${filteredSection[0]?.data?.nodeTitle}?summary=${activeSectionSummary[activeSummaryIndex]?.id}`
      // );

      // dispatch(
      //   getSetSectionId({
      //     id: activeSectionId || "",
      //     index: activeSectionIndex,
      //     sectionNodeData: allDatas,
      //     sectionList: sectionLists,
      //     summaryId: activeSectionSummary[activeSummaryIndex]?.id || "",
      //     summaryIndex: activeSummaryIndex,
      //   })
      // );
    } else {
      onStart();
      // const eligibilityProgress = progressData.find(
      //   (val: any) => val.sectionKey == "General_Eligibility"
      // );
      // const missingFiels = eligibilityProgress?.missingFlowIds?.length
      //   ? eligibilityProgress?.missingFlowIds[0]
      //   : "";
      // if (missingFiels) {
      //   const nodesData = JSON.parse(getSignleFormData?.flowJson);
      //   const mainData = currentIdObjects(missingFiels, nodesData);
      //   const activeSectionSummary =
      //     sectionListsMainData[mainData?.currentSectionIndex]?.children;
      //   const activeSummaryIndex = activeSectionSummary?.findIndex(
      //     (ele: any) => ele === mainData?.currentGroupSummaryId
      //   );
      //   navigate(`/eligibility-check/${mainData?.currentSectionId}`);
      //   dispatch(
      //     getSetSectionId({
      //       id: mainData?.currentSectionId || "",
      //       summaryId: mainData?.currentGroupSummaryId,
      //       questionGroupId: mainData?.currentQuestionGroupId,
      //       sectionNodeData: allDatas,
      //       sectionList: sectionLists,
      //       index: 0,
      //       summaryIndex: activeSummaryIndex,
      //     })
      //   );
      // }
    }
  };

  const handleLocking = async (flag = false) => {
    const tempUnSavedFormValues: any =
      sessionStorage.getItem("unSavedFormValues");
    const tempUpdatedFormValues: any =
      sessionStorage.getItem("updatedFormValues");
    // const tempUnSavedFormValues: any =
    //   localStorage.getItem("unSavedFormValues");
    // const tempUpdatedFormValues: any =
    //   localStorage.getItem("updatedFormValues");

    let updatedFormValues = JSON.parse(tempUpdatedFormValues);
    let unSavedFormValues = JSON.parse(tempUnSavedFormValues);

    updatedFormValues = {
      ...updatedFormValues,
      ["ui_form_lock_state"]: flag,
    };

    await dispatch(
      addUserForm({
        form_data: JSON.stringify(updatedFormValues),
      })
    ).then((res: any) => {
      if (res?.payload?.data) {
        sessionStorage.setItem(
          "unSavedFormValues",
          JSON.stringify({ ...unSavedFormValues, ["ui_form_lock_state"]: flag })
        );
        // localStorage.setItem(
        //   "unSavedFormValues",
        //   JSON.stringify({ ...unSavedFormValues, ["ui_form_lock_state"]: flag })
        // );
        setLocked(flag);
      }
    });
  };

  const getActionButton = () => {
    if (
      progressData &&
      progressData?.length &&
      sectionLists &&
      sectionLists?.length &&
      !anonymousUser()
    ) {
      if (
        progressData?.filter(
          (obj: any) =>
            obj?.percentComplete == 0 &&
            obj?.sectionKey == "General_Eligibility"
        )?.length
      ) {
        return (
          <Button
            variant="contained"
            sx={{
              background: "#3260e4",
              boxShadow: "none",
              "&:hover": {
                background: "#3260e4",
              },
            }}
            onClick={onStart}
            disabled={paymentLoader}
          >
            Start
          </Button>
        );
      } else if (
        progressData?.filter(
          (obj: any) =>
            obj?.percentComplete > 0 && obj?.sectionKey == "General_Eligibility"
        )?.length
      ) {
        return (
          <Button
            variant="contained"
            sx={{
              background: "#2563eb",
              boxShadow: "none",
              "&:hover": {
                background: "#3260e4",
              },
            }}
            onClick={onResumeClick}
            disabled={paymentLoader}
          >
            Resume
          </Button>
        );
      } else if (
        progressData &&
        sectionLists &&
        progressData?.filter((obj: any) => obj?.percentComplete >= 100)
          ?.length == sectionLists?.length
      ) {
        return (
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              // padding: "4px",
              textAlign: "center",
              fontSize: "14px",
              lineHeight: "20px",
              // background: "#e9fbf0",
              color: "#2dac5d",
              // borderRadius: "32px",
            }}
            variant="caption"
            component="div"
            fontFamily="Sen"
          >
            Completed
          </Typography>
        );
      }
    } else if (anonymousUser()) {
      return (
        <Button
          variant="contained"
          sx={{
            background: "#3260e4",
            boxShadow: "none",
            "&:hover": {
              background: "#3260e4",
            },
          }}
          onClick={onStart}
          disabled={paymentLoader}
        >
          Start
        </Button>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {(loading || uiFormPayloadLoading) && !anonymousUser() && (
        <BackDropLoader />
      )}
      <Container maxWidth="lg">
        <Box
          className="custom-scrollbar payment"
          height={"calc(100vh - 133px)"}
          overflow={"auto"}
          style={{ paddingBottom: "100px" }}
        >
          <Paper
            className="homepage"
            sx={{
              border: "1px solid #ddd",
              borderRadius: "20px",
              boxShadow: "none",
              padding: { md: "20px", xs: "10px" },
            }}
          >
            <h1>Applications</h1>
            <Box className="home-application-title md:flex block justify-between">
              <Typography variant="h4">
                Marriage based AOS
                {/* 1. {lastLoginData?.data?.nodeTitle} */}
              </Typography>
              <Box sx={{ display: "flex", mt: { md: 0, xs: 1 } }}>
                {getActionButton()}
                {/* {progressData?.length !== 0 &&
              progressData?.filter(
                (obj: any) =>
                  obj?.percentComplete > 0 &&
                  obj?.sectionKey == "General_Eligibility"
              )?.length <= sectionLists?.length && (
                <Button
                  variant="contained"
                  sx={{
                    background: "#3260e4",
                    boxShadow: "none",
                    "&:hover": {
                      background: "#3260e4",
                    },
                  }}
                  onClick={onResumeClick}
                >
                  Resume
                </Button>
              )}
            {progressData?.length !== 0 &&
              sectionLists?.length !== 0 &&
              (progressData?.filter((obj: any) => obj?.percentComplete == 0)
                ?.length == sectionLists?.length ? (
                
              ) : (
                progressData?.filter((obj: any) => obj?.percentComplete >= 100)
                  ?.length == sectionLists?.length && (
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      // padding: "4px",
                      textAlign: "center",
                      fontSize: "14px",
                      lineHeight: "20px",
                      // background: "#e9fbf0",
                      color: "#2dac5d",
                      // borderRadius: "32px",
                    }}
                    variant="caption"
                    component="div"
                    fontFamily="Sen"
                  >
                    Completed
                  </Typography>
                )
              ))} */}

                {!anonymousUser() && (
                  <>
                    <Button
                      variant="outlined"
                      sx={
                        !locked
                          ? { background: "#eff6ff" }
                          : { color: "#2563eb !important" }
                      }
                      onClick={() => handleLocking(true)}
                      disabled={!locked && !paymentLoader ? false : true}
                    >
                      <LockOutlinedIcon />
                      Lock
                    </Button>
                    <Button
                      variant="outlined"
                      disabled={locked ? false : true}
                      sx={
                        locked
                          ? { background: "#eff6ff" }
                          : { color: "#9ebaf6 !important" }
                      }
                      onClick={() => handleLocking(false)}
                    >
                      <LockOpenOutlinedIcon />
                      Unlock
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Paper>
          <Box>
            <Grid container spacing={2}>
              {!anonymousUser() && (
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      padding: { md: "20px", xs: "10px" },
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      boxShadow: "none",
                    }}
                  >
                    <h1 style={{ fontWeight: "600", marginBottom: "10px" }}>
                      Billing
                    </h1>

                    <Box sx={{ margin: "10px 0 0" }}>
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: "20px",
                          mr: 1,
                          textTransform: "capitalize",
                          background: "#2563eb",
                          boxShadow: "none",
                        }}
                        disabled={paymentLoader}
                      >
                        View Invoice
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              )}
              <Grid item xs={12} md={anonymousUser() ? 12 : 6}>
                <Paper
                  sx={{
                    padding: { md: "20px", xs: "10px" },
                    border: "1px solid #ddd",
                    borderRadius: "20px",
                    boxShadow: "none",
                    overflowY: "auto",
                    mb: "100px",
                  }}
                >
                  {anonymousUser() ? (
                    <>
                      <Box
                        sx={{
                          background: "#eff6fe",
                          borderRadius: "12px",
                          m: "0 auto",
                        }}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <SignInSignUpButton source={"home"} onStart={onStart} />
                      </Box>
                    </>
                  ) : (
                    <>
                      <h1 style={{ fontWeight: "600", marginBottom: "10px" }}>
                        Pay and Download
                      </h1>
                      <PayAndDownloadButton isBoth={true} />
                    </>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
