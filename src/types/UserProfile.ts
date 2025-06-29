export interface FormInputUser {
  Age?: number;
  Avg_Daily_Usage_Hours?: number;
  Sleep_Hours_Per_Night?: number;
  Conflicts_Over_Social_Media?: number;
  Academic_Level_Graduate?: boolean;
  Academic_Level_High_School?: boolean;
  Academic_Level_Undergraduate?: boolean;
  Most_Used_Platform_Facebook?: boolean;
  Most_Used_Platform_Instagram?: boolean;
    Most_Used_Platform_KakaoTalk?: boolean;
    Most_Used_Platform_LINE?: boolean;
    Most_Used_Platform_LinkedIn?: boolean;
    Most_Used_Platform_Snapchat?: boolean;
    Most_Used_Platform_TikTok?: boolean;
    Most_Used_Platform_Twitter?: boolean;
    Most_Used_Platform_VKontakte?: boolean;
    Most_Used_Platform_WeChat?: boolean;
    Most_Used_Platform_WhatsApp?: boolean;
    Most_Used_Platform_YouTube?: boolean;
    Relationship_Status_Complicated?: boolean;
    Relationship_Status_In_Relationship?: boolean;
    Relationship_Status_Single?: boolean
  Gender_Female?: boolean;
  Gender_Male?: boolean;
}

export interface CalculatedScores {
  Mental_Health_Score: number;
  Mental_Health_Interpretation: string;
  Addiction_Score: number;
  Addiction_Level: string;
  Affects_Academic_Performance: boolean;
  Academic_Performance_Probability: number;
}