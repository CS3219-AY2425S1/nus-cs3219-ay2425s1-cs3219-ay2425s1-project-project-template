"use client";

const submitCodeResponse = {
  statusCode: 200,
  message: "Success",
  data: {
    status: "ok",
    result: {
      stdout: "7236\n",
      stderr: "",
      executionTime: 22,
    },
  },
};

export default function TestResultTabContent() {
  return (
    <div className="p-2 h-full w-full">
      <div className="flex justify-center items-center w-full h-full">
        <p>
          You must submit your code to see the test result:{" "}
          {submitCodeResponse.statusCode}
        </p>
      </div>
      {/* <div>
        <p className="p-2">Test result</p>
      </div> */}
    </div>
  );
}
