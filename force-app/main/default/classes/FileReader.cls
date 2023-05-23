public without sharing class FileReader {
    
    private static final String  BASE_URL = URL.getSalesforceBaseUrl().toExternalForm();

    //Reterives all files of one case or account record 
    @AuraEnabled
    public static List<FileData> GetEntityRecordFiles(string recordId)
    {
        List<ContentDocumentLink> links=[SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink where LinkedEntityId=:recordId];
        Set<Id> ids=new Set<Id>();
        for(ContentDocumentLink link:links)
        {
            ids.add(link.ContentDocumentId);
        }
        List<ContentVersion> versions=[SELECT VersionData,Title,ContentDocumentId,FileExtension FROM ContentVersion WHERE ContentDocumentId = :ids AND IsLatest = true];
        
        List<FileData> files=new List<FileData>();
        for(ContentVersion attach:versions)
         {
            FileData data=new FileData();
            if(versions!=null && versions.size()>0)
            {
                data.Content = EncodingUtil.base64Encode(versions[0].VersionData);
                data.ContentType = ContentType(versions[0].FileExtension);
            }
            data.DownloadUrl =BASE_URL + '/sfc/servlet.shepherd/document/download/'+versions[0].ContentDocumentId;
            data.FileUrl =BASE_URL + '/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId='+versions[0].Id;
            files.add(data);
        }
        return files;
    }
    
    
    //Reterives specific file information
  	@AuraEnabled
    public static FileData GetFile(string contentDocumentId)
    {
       contentDocumentId =  '0695i00000B67n6AAB';
        List<ContentVersion> versions=[SELECT Id,VersionData,Title,ContentDocumentId,FileExtension FROM ContentVersion WHERE ContentDocumentId = :contentDocumentId ];
        FileData data=new FileData();
        if(versions!=null && versions.size()>0)
        {
            data.Content = EncodingUtil.base64Encode(versions[0].VersionData);
            data.ContentType = ContentType(versions[0].FileExtension);
        }
       
        data.DownloadUrl =BASE_URL + '/sfc/servlet.shepherd/document/download/'+versions[0].ContentDocumentId;
        data.FileUrl =BASE_URL + '/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId='+versions[0].Id;
       	return data;
    }
    public static string ContentType(string fileType)
    {
        switch on fileType.toLowerCase()
        {
            when 'docx'
            {
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            }
            when 'csv'
            {
                return 'application/vnd.ms-excel';
            }
            when 'wav'
            {
                return 'audio/wav';
            }
            when 'wmv'
            {
                return 'video/x-ms-wmv';
            }
            when 'mp3'
            {
                return 'audio/mpeg';
            }
            when 'mp4'
            {
                return 'video/mp4';
            }
            when 'png'
            {
                return 'image/png';
                
            }
            when 'pdf'
            {
                return 'application/pdf';
                
            }
            when else {
                return 'image/jpeg';
            }
        }
    }
   
    public class FileData 
    {
        @AuraEnabled
        public string Content{get;set;}
        @AuraEnabled
        public string ContentType{get;set;}
        @AuraEnabled
        public string FileUrl{get;set;}
        @AuraEnabled
        public string DownloadUrl{get;set;}
	}
}