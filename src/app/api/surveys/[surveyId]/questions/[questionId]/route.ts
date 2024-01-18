import routeHandler from "@/lib/routeHandler";
import prisma from "@/lib/prisma";
import Question from "@/schemas/Question";

export const DELETE = routeHandler(async (request, context) => {
  const { surveyId, questionId } = context.params;
  const response = await prisma.survey.update({
    where: {
      id: surveyId,
    },
    data: {
      questions: {
        delete: {
          id: questionId,
        },
      },
    },
    include: {
      questions: true,
    },
  });

  return response;
});

export const PATCH = routeHandler(async (request, context) => {
  const { surveyId, questionId } = context.params;
  const body = await request.json();

  try {
    const validation = await Question.safeParseAsync(body);
    if (!validation.success) {
      throw validation.error;
    }

    const { data } = validation;

    const updatedQuestion = await prisma.question.update({
      where: {
        id: questionId,
      },
      data,
    });

    return updatedQuestion;
  } catch (e) {
    return {
      error: "Something went wrong...",
      status: 500,
    };
  }
});