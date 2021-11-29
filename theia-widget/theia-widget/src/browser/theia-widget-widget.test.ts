import "reflect-metadata";
import {
  ILogger,
  MessageService,
} from "@theia/core";
import { ContainerModule, Container } from "@theia/core/shared/inversify";
import { Event } from '@theia/core/lib/common/event';
import { FrontendApplicationConfigProvider } from "@theia/core/lib/browser/frontend-application-config-provider";
import { ApplicationProps } from "@theia/application-package/lib/application-props";
FrontendApplicationConfigProvider.set({
  ...ApplicationProps.DEFAULT.frontend.config,
});
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { TheiaWidgetWidget } from "./theia-widget-widget";
import { render } from "@testing-library/react";
import { MockLogger } from "./mock-logger";
import { StorageService, LocalStorageService } from "@theia/core/lib/browser";
import { ProblemManager } from '@theia/markers/lib/browser/problem/problem-manager';


describe("TheiaWidgetWidget", () => {
  let widget: TheiaWidgetWidget;

  beforeEach(async () => {


    const module = new ContainerModule((bind) => {
      bind(ILogger).to(MockLogger);
      bind(StorageService).to(LocalStorageService).inSingletonScope();
      bind(LocalStorageService).toSelf().inSingletonScope();
      bind(FileService).toConstantValue(<FileService>{
        onDidFilesChange: Event.None
      });
      bind(ProblemManager).toSelf();

      bind(MessageService).toConstantValue({
        info(message: string): void {
          console.log(message);
        },
      } as MessageService);
      bind(TheiaWidgetWidget).toSelf();
    });
    const container = new Container();
    container.load(module);
    widget = container.resolve<TheiaWidgetWidget>(TheiaWidgetWidget);
  });

  it("should render react node correctly", async () => {
    const element = render(widget.render());
    expect(element.queryByText("Display Message")).toBeTruthy();
  });

  it("should inject 'MessageService'", () => {
    const spy = jest.spyOn(widget as any, "displayMessage");
    widget["displayMessage"]();
    expect(spy).toBeCalled();
  });
});
