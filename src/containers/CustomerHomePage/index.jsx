import React from "react";
import { NavBar } from "../../components/navbar";
import { PageContainer } from "../../components/pageContainer";
import { TopSection } from "./topSection";


export function CustomerHomePage(props){
    return (
    <PageContainer>
        <TopSection>
            <NavBar />
        </TopSection>
    </PageContainer>
    );
}