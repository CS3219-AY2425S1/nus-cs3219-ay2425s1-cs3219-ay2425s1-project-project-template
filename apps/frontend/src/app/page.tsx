"use client";
import Header from "@/components/Header/header";
import { Button, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import "./styles.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HomePage = () => {
  const { push } = useRouter();
  return (
    <Layout className="layout">
      <Header selectedKey={undefined} />
      <Content className="content">
        <div className="home-content-card">
          <div className="left-panel">
            <div className="logo-container">
              <div className="logo1-title">Peer</div>
              <div className="logo2-title">Prep</div>
            </div>
            <div className="slogan">
              <text className="slogan-1">
                A better way to prepare for coding interviews with
              </text>
              <text className="slogan-2"> peers</text>
            </div>
            <div className="button-container">
              <Button
                className="match-button"
                onClick={() => push("/matching")}
              >
                Start Matching
              </Button>
            </div>
          </div>
          <div className="right-panel">
            <Image
              src="/assets/coding.gif"
              alt="my gif"
              height={420}
              width={566}
              unoptimized
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default HomePage;
