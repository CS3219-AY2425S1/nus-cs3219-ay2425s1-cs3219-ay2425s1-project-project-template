import { FileDoneOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Button, Input, Spin, Tabs, TabsProps } from "antd";
import "./styles.scss";

interface TestcaseDetailProps {
  testcaseItems?: TabsProps["items"];
  shouldShowSubmitButton?: boolean;
  isLoadingTestCase?: boolean;
  handleRunTestCases?: () => void;
  buttonIsDisabled?: boolean;
}

export const TestcaseDetail = (props: TestcaseDetailProps) => {
  // TODO: Tabs component items for testcases
  // TODO: Setup test-cases in db for each qn and pull/paste here
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Case 1",
      children: (
        <Input.TextArea disabled placeholder="Insert Test Case 1" rows={6} />
      ),
    },
    {
      key: "2",
      label: "Case 2",
      children: (
        <Input.TextArea disabled placeholder="Insert Test Case 2" rows={6} />
      ),
    },
    // {
    //   key: "3",
    //   label: "Case 3",
    //   children: (
    //     <Input.TextArea placeholder="Input Manual Test Case" rows={6} />
    //   ),
    // },
  ];

  return (
    <div className="test-container">
      <div className="test-top-container">
        <div className="test-title">
          <FileDoneOutlined className="title-icons" />
          Test Cases
        </div>
        {/* TODO: Link to execution service for running code against test-cases */}
        {props.shouldShowSubmitButton && (
          <div className="test-button-container">
            <div className="spinner-container">
              {props.isLoadingTestCase && <Spin tip="Running test cases..." />}
            </div>
            <Button
              icon={<PlayCircleOutlined />}
              iconPosition="end"
              className="test-case-button"
              onClick={props.handleRunTestCases}
              disabled={props.buttonIsDisabled}
            >
              Run Test Cases
            </Button>
          </div>
        )}
      </div>
      <div className="test-cases-container">
        <Tabs items={props.testcaseItems || items} defaultActiveKey="1" />
      </div>
    </div>
  );
};
